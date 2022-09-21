module.exports = function (babel) {
  const t = babel.types
  return {
    inherits: require('@babel/plugin-syntax-jsx').default,
    visitor: {
      JSXElement(path) {
        path.replaceWith(converJSX(path))
      },
      'ClassMethod|FunctionDeclaration|ObjectMethod'(path, state) {
        const jsxChecker = {
          hasJsx: false,
        }
        path.traverse(
          {
            JSXElement(path) {
              this.hasJsx = true
              path.stop()
            },
          },
          jsxChecker
        )
        if (!jsxChecker.hasJsx) {
          return
        }
        if (
          !path.node.params.length ||
          (path.node.params.length &&
            path.node.params[path.node.params.length - 1].name !== 'h' &&
            path.node.key?.name !== 'constructor')
        ) {
          path
            .get('body')
            .unshiftContainer(
              'body',
              t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier('h'),
                  t.memberExpression(
                    t.identifier('arguments'),
                    t.binaryExpression(
                      '-',
                      t.memberExpression(t.identifier('arguments'), t.identifier('length'), false),
                      t.numericLiteral(1)
                    ),
                    true
                  )
                ),
              ])
            )
        }
      },
    },
  }
  function convertAttrName(node) {
    if (t.isJSXNamespacedName(node.name)) {
      // 带命名空间的属性 如 xlink:href 等等
      return t.stringLiteral(node.name.namespace.name + ':' + node.name.name.name)
    } else {
      return t.stringLiteral(node.name.name)
    }
  }
  function convertAttrValue(node) {
    return t.isJSXExpressionContainer(node.value)
      ? node.value.expression
      : // 直接写属性名 默认赋值为true
      node.value
      ? t.stringLiteral(node.value.value)
      : t.booleanLiteral(true)
  }
  function convertAttribute(attrs) {
    return t.ObjectExpression(
      attrs.map((i) => {
        // 普通键值对传参
        if (t.isJSXAttribute(i)) {
          const name = convertAttrName(i)
          const value = convertAttrValue(i)
          return t.ObjectProperty(name, value)
          // 处理解构传参
        } else if (t.isJSXSpreadAttribute(i)) {
          return t.spreadElement(i.argument)
        }
      })
    )
  }
  function converJSX(path) {
    if (path.isJSXElement()) {
      const tagName = path.node.openingElement.name.name
      return t.callExpression(t.identifier('h'), [
        // 首字母大写的被视作组件处理
        tagName.charCodeAt(0) < 96 ? t.identifier(tagName) : t.stringLiteral(tagName),
        convertAttribute(path.node.openingElement.attributes),
        t.ArrayExpression(
          path
            .get('children')
            .map((ele) => converJSX(ele))
            .filter((ele) => ele)
        ),
      ])
    } else if (path.isJSXText()) {
      return path.node.value.replace(/\n\s+/g, '')
        ? t.stringLiteral(path.node.value.replace(/\n\s+/g, ''))
        : null
    } else if (path.isJSXExpressionContainer()) {
      // 注释转化成空字符串节点，空串不会被渲染函数处理
      if (path.get('expression').isJSXEmptyExpression()) {
        // t.stringLiteral('')
        return null
      } else {
        return path.node.expression
      }
    }
  }
}
