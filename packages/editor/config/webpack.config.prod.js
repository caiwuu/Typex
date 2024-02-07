const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const prodConfig = merge(baseConfig, {
  mode: 'production',
  devtool: 'eval-cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  }
})
module.exports = prodConfig
