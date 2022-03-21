const babel = require('@babel/core')
const t = require('@babel/types')

// const code = `
//     const a = 3 * 103.5 * 0.8;
//     log(a);
//     const b = a + 105 - 12;
//     log(b);
// `

// const visitor = {
//   CallExpression(path) {
//     // 这里判断一下如果不是log的函数执行语句则不处理
//     if (path.node.callee.name !== 'log') return
//     // t.CallExpression 和 t.MemberExpression分别代表生成对于type的节点，path.replaceWith表示要去替换节点,这里我们只改变CallExpression第一个参数的值，第二个参数则用它自己原来的内容，即本来有的参数
//     path.replaceWith(t.CallExpression(t.MemberExpression(t.identifier('console'), t.identifier('log')), path.node.arguments))
//   },
// }

// const result = babel.transform(code, {
//   plugins: [
//     {
//       visitor: visitor,
//     },
//   ],
// })

// console.log(result.code)
// path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')))
// path
//   .get('body')
//   .pushContainer(
//     'body',
//     t.callExpression(t.identifier('h'), [
//       t.stringLiteral(ops.tagName),
//       t.ObjectExpression([t.ObjectProperty(t.stringLiteral('name'), t.stringLiteral('name'))]),
//     ])
//   )

const code = `
  export class Paragraph extends Component {
    render() {
      return (
        <div  style='color:#666;;padding:6px 20px;' id='12'>
        <svg class='icon' aria-hidden={true} ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        </div>
      )
    }
  }
  
`
function convertAttrName(node) {
  if (t.isJSXNamespacedName(node.name)) {
    return t.identifier(node.name.namespace.name + ':' + node.name.name.name)
  } else {
    return t.identifier(node.name.name)
  }
}
function convertAttrValue(node) {
  return t.isJSXExpressionContainer(node.value)
    ? node.value.expression
    : t.stringLiteral(node.value.value)
}
function convertAttribute(attrs) {
  return t.ObjectExpression(
    attrs.map((i) => {
      const name = convertAttrName(i)
      const value = convertAttrValue(i)
      return t.ObjectProperty(name, value)
    })
  )
}
// {tools.map((ele) => h(ToolBarItem, { onCommand: this.onCommand, ...ele }))}

function converJSX(path) {
  // console.log(path)
  if (path.isJSXElement()) {
    const tagName = path.node.openingElement.name.name
    const attrs = path.node.openingElement.attributes.reduce((r, i) => {
      r[i.name.name] = i.value
      r.push(i)
      return r
    }, [])
    return t.callExpression(t.identifier('h'), [
      t.stringLiteral(tagName),
      convertAttribute(path.node.openingElement.attributes),
      t.ArrayExpression(path.get('children').map((ele) => converJSX(ele))),
    ])
  } else if (path.isJSXText()) {
    return t.stringLiteral(path.node.value)
  } else if (path.isJSXExpressionContainer()) {
    return path.node.expression
  }
}
const visitor = {
  'ClassMethod|FunctionDeclaration'(path) {
    const jsxChecker = {
      hasJsx: false,
    }
    path.traverse(
      {
        JSXElement() {
          this.hasJsx = true
          path.stop()
        },
      },
      jsxChecker
    )
    if (!jsxChecker.hasJsx) {
      return
    }
    if (path.node.key?.name === 'render' || path.node.id?.name === 'render') {
      path
        .get('body')
        .unshiftContainer(
          'body',
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('h'),
              t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true)
            ),
          ])
        )
      path.traverse({
        ReturnStatement(path) {
          path.traverse({
            JSXElement(path, state) {
              path.replaceWith(converJSX(path))
            },
          })
        },
      })
    }
  },
}

const result = babel.transform(code, {
  plugins: [
    '@babel/plugin-syntax-jsx',
    {
      visitor: visitor,
    },
  ],
})

console.log(result.code)
