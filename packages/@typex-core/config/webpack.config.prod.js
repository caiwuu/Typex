const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const prodConfig = merge(baseConfig, {
  devtool: 'eval-cheap-module-source-map',
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  }
})
module.exports = prodConfig
