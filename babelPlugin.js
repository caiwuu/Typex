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

const code = `
  export class Paragraph extends Component {
    render(h) {
      return h(<div  style='color:#666;;padding:6px 20px;' id='12'>{this.props.children.length ? this.props.children : '一个段落'}</div>)
    }
  }
  function aa(){}
`
const isRender = false
const visitor = {
  ClassMethod(path) {
    if (path.node.key.name === 'render') {
      path
        .get('body')
        .unshiftContainer(
          'body',
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('h'),
              isRender
                ? t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true)
                : t.memberExpression(t.thisExpression(), t.identifier('$createElement'))
            ),
          ])
        )
      const ops = {}
      path.traverse(
        {
          CallExpression(path) {
            if (path.node.callee.name === 'h') {
              path.node.callee = t.memberExpression(
                t.memberExpression(t.thisExpression(), t.identifier('v')),
                t.identifier('$createElement')
              )
            }
            path.traverse(
              {
                JSXElement(path, state) {
                  const tagName = path.node.openingElement.name.name
                  const attrs = path.node.openingElement.attributes.reduce((r, i) => {
                    r[i.name.name] = i.value.value
                    return r
                  }, {})
                  this.ops.tagName = tagName
                  this.ops.attrs = attrs
                },
              },
              {
                ops: this.ops,
              }
            )
          },
        },
        { ops }
      )
      console.log(ops)
      path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')))
      path
        .get('body')
        .pushContainer(
          'body',
          t.callExpression(t.identifier('h'), [
            t.stringLiteral(ops.tagName),
            t.ObjectExpression([
              t.ObjectProperty(t.stringLiteral('name'), t.stringLiteral('name')),
            ]),
          ])
        )
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
