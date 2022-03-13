import Editor from './editor/index'
const editor = new Editor()
editor.setTools([
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-undo',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-todo',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-header',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-font-size',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-color',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-bold',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-underline',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-del',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-fill',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-align-left',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-align-middle',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-align-right',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-link',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-img',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-code',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-markdown',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-radio',
  },
  {
    label: '加粗(B)',
    command: 'bold',
    icon: '#icon-clear-style',
  },
])
editor.mount('editor-root')
window.editor = editor
