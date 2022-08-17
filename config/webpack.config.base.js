const path = require('path') //调用node.js中的路径
const WebpackBar = require('webpackbar')
module.exports = {
  entry: {
    index: './src/index.js', //需要打包的文件
  },
  output: {
    filename: '[name].js', //输入的文件名是什么，生成的文件名也是什么
    path: path.resolve(__dirname, '../dist'), //指定生成的文件目录
  },
  resolve: {
    // 设置别名
    alias: {
      '@': path.resolve('src'), // 这样配置后 @ 可以指向 src 目录
    },
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [new WebpackBar()],
}
