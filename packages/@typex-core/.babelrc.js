const editorJsx = require('babel-plugin-transform-typex-jsx')
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [editorJsx],
}
