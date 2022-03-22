const editorJsx = require('./babel-plugin-transform-editor-jsx.js')
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
