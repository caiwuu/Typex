import Editor from './editor/index'
const editor = new Editor()
editor.setTools([
  { label: '加粗', command: 'bold' },
  { label: '倾斜', command: 'italic' },
])
editor.mount('editor-root')
