import Editor from './editor/index'
const editor = new Editor()
editor.setTools([
  { label: '加粗(B)', command: 'bold' },
  { label: '倾斜(I)', command: 'italic' },
])
editor.mount('editor-root')
