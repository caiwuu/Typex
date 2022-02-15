const path = require('path') //调用node.js中的路径
const WebpackBar = require('webpackbar')
const testPlugin = function ({ types: t }) {
  return {
    name: 'add-debug-information',
    visitor: {
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee, { name: 'myFunction' }) && path.node.arguments.length > 1) {
          path.pushContainer('arguments', t.identifier('__filename'))
        }
      },
    },
  }
}
module.exports = {
  entry: {
    index: './src/index.js', //需要打包的文件
  },
  output: {
    filename: '[name].js', //输入的文件名是什么，生成的文件名也是什么
    path: path.resolve(__dirname, '../dist'), //指定生成的文件目录
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   use: {
      //     loader: path.resolve(__dirname, '../loader/css-loader.js'),
      //   },
      // },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], //最新JS语法后向兼容
            // plugins: [testPlugin], //JSX编译
          },
        },
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [new WebpackBar()],
}
