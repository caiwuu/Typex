import Editor from './editor/index'
const editor = new Editor()
editor.setTools([
  {
    label: '加粗(B)', command: 'bold', icon: '#icon-fuwenbenbianjiqi_chexiao'
  },
  {
    label: '加粗(B)', command: 'bold', icon: '#icon-fuwenbenbianjiqi_zhongzuo'
  },
  { label: '加粗(B)', command: 'bold', icon: '#icon-fuwenbenbianjiqi_zitiyanse' },
  { label: '加粗(B)', command: 'bold', icon: '#icon-fuwenben_jiacu' },
  { label: '倾斜(I)', command: 'italic', icon: '#icon-fuwenben_shuzi' },
])
editor.mount('editor-root')
window.editor = editor