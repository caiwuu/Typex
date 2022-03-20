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
      return h(<div style='color:#666;;padding:6px 20px;'>{this.props.children.length ? this.props.children : '一个段落'}</div>)
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
              isRender ? t.memberExpression(t.identifier('arguments'), t.numericLiteral(0), true) : t.memberExpression(t.thisExpression(), t.identifier('$createElement'))
            ),
          ])
        )
      path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')))
      path.traverse({
        CallExpression(path) {
          if (path.node.callee.name === 'h') {
            path.node.callee.name = 'this.$createElement'
          }
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
