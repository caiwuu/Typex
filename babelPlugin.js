const babel = require('@babel/core')
const t = require('@babel/types')
const code = `
  export class Paragraph extends Component {
    render(EE) {
      return (
         <span
        onClick={this.click}
      >
        <svg class='icon' aria-hidden={true} ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
      </span>
      )
    }
  }
  function renderee(h,__editor__){
    return <span>2323</span>
  }
  function rendere(h,__editor__){
    return 23
  }
`
const visitor = {
  'ClassMethod|FunctionDeclaration'(path, state) {
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
    if (isConvertable(path, state)) {
      if (path.node.params.length && path.node.params[0].name !== 'h') {
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
      }
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
function isConvertable(path, state) {
  if (state.opts.nameSpace) {
    return (
      path.node.params.length && path.node.params[path.node.params.length - 1].name === '__editor__'
    )
  } else {
    return true
  }
}
function convertAttrName(node) {
  if (t.isJSXNamespacedName(node.name)) {
    return t.stringLiteral(node.name.namespace.name + ':' + node.name.name.name)
  } else {
    return t.stringLiteral(node.name.name)
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
function converJSX(path) {
  if (path.isJSXElement()) {
    const tagName = path.node.openingElement.name.name
    return t.callExpression(t.identifier('h'), [
      t.stringLiteral(tagName),
      convertAttribute(path.node.openingElement.attributes),
      t.ArrayExpression(path.get('children').map((ele) => converJSX(ele))),
    ])
  } else if (path.isJSXText()) {
    return t.stringLiteral(path.node.value.replace(/\n\s+/g, ''))
  } else if (path.isJSXExpressionContainer()) {
    return path.node.expression
  }
}

const result = babel.transform(code, {
  plugins: [
    '@babel/plugin-syntax-jsx',
    [
      {
        visitor: visitor,
      },
      { nameSpace: 'EE' },
    ],
  ],
})

console.log(result.code)
