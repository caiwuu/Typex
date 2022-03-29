import Editor from './editor/index'
const editor = new Editor()
import './style/index.styl'
editor.setTools([
  {
    tooltip: '撤销',
    command: 'undo',
    icon: '#icon-undo',
  },
  {
    tooltip: '重做',
    command: 'todo',
    icon: '#icon-todo',
  },
  {
    tooltip: '标题',
    command: 'H',
    icon: '#icon-header',
  },
  {
    tooltip: '字体大小',
    command: '$FZ',
    icon: '#icon-font-size',
  },
  {
    tooltip: '字体颜色',
    command: '$FC',
    icon: '#icon-color',
  },
  {
    tooltip: '加粗',
    command: 'B',
    icon: '#icon-bold',
  },
  {
    tooltip: '下划线',
    command: 'U',
    icon: '#icon-underline',
  },
  {
    tooltip: '删除线',
    command: 'D',
    icon: '#icon-del',
  },
  {
    tooltip: '背景填充',
    command: '$FI',
    icon: '#icon-fill',
  },
  {
    tooltip: '左对齐',
    command: 'left',
    icon: '#icon-align-left',
  },
  {
    tooltip: '居中',
    command: 'middle',
    icon: '#icon-align-middle',
  },
  {
    tooltip: '右对齐',
    command: 'right',
    icon: '#icon-align-right',
  },
  {
    tooltip: '超链接',
    command: 'link',
    icon: '#icon-link',
  },
  {
    tooltip: '图片',
    command: 'img',
    icon: '#icon-img',
  },
  {
    tooltip: '代码段',
    command: 'code',
    icon: '#icon-code',
  },
  {
    tooltip: 'markdown',
    command: 'markdown',
    icon: '#icon-markdown',
  },
  {
    tooltip: '视频',
    command: 'radio',
    icon: '#icon-radio',
  },
  {
    tooltip: '清除样式',
    command: 'clear',
    icon: '#icon-clear-style',
  },
])
editor.mount('editor-root')
window.editor = editor
