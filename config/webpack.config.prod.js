const { merge } = require('webpack-merge');
const path = require('path'); //调用node.js中的路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const prodConfig = merge(baseConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
});
module.exports = prodConfig;
