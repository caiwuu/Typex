const babel = require('@babel/core')
const t = require('@babel/types')
const code = `
function renderRoot(editor) {
  return <div id='editor-root'>{formater.render([editor.$marks])}</div>
}
const aa=function(){
  return (<div style='font-size:0;width:228px;'>
        <Palette ref={this.paletteRef} hue={this.hueRef}></Palette>
        <Hue ref={this.hueRef} color={this.props.color} paletteRef={this.paletteRef}></Hue>
      </div>)
}
export default class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
    this.hueRef = createRef()
    const aa = <span>111</span>
  }
  render() {
    return (
      <div style='font-size:0;width:228px;'>
        <Palette ref={this.paletteRef} hue={this.hueRef}></Palette>
        <Hue ref={this.hueRef} color={this.props.color} paletteRef={this.paletteRef}></Hue>
      </div>
    )
  }
  onMounted() {
    console.log('ColorPicker')
  }
}
`
const visitor = {
  JSXElement(path) {
    path.replaceWith(converJSX(path))
  },
  'ClassMethod|FunctionDeclaration'(path) {
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
