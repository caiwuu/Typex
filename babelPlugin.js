const babel = require('@babel/core')
const t = require('@babel/types')
const code = `
class ToolBar extends Component {
  constructor(props) {
    super(props)
    this.dialogRef = createRef()
  }
  render() {
    const { tools } = this.props
    return (
      <Paragraph>
        <span style='color:red'>123</span>
      </Paragraph>
    )
  }
  onCommand = (command) => {
    this.props.onCommand(command)
    this.dialogRef.current.toggle()
  }
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
        JSXElement(path, state) {
          path.replaceWith(converJSX(path))
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
    : node.value
    ? t.stringLiteral(node.value.value)
    : t.booleanLiteral(true)
}
function convertAttribute(attrs) {
  return t.ObjectExpression(
    attrs.map((i) => {
      if (t.isJSXAttribute(i)) {
        const name = convertAttrName(i)
        const value = convertAttrValue(i)
        return t.ObjectProperty(name, value)
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
      { nameSpace: false },
    ],
  ],
})

console.log(result.code)
