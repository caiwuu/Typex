/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-26 15:22:44
 */
// 编辑器demo
import createEditor from './editor'
import './style.styl'
function setFormat(editor,callback){
  editor.selection.ranges.forEach((range) => {
    const path = range.container
    path.component.setFormat(range, callback)
  })
}
const toolBar = [
  {
    tooltip: '撤销',
    commandName: 'undo',
    icon: '#icon-undo',
    commandHandle:(editor)=>{
      editor.history.undo()
    }
  },
  {
    tooltip: '重做',
    commandName: 'redo',
    icon: '#icon-todo',
    commandHandle:(editor)=>{
      editor.history.redo()
    }
  },
  {
    tooltip: '标题',
    commandName: 'header',
    icon: '#icon-header',
  },
  {
    tooltip: '字体大小',
    commandName: 'fontSize',
    icon: '#icon-font-size',
    options:{}
  },
  {
    tooltip: '字体颜色',
    commandName: 'fontColor',
    icon: '#icon-color',
    options:{
      componentName:'fontColor'
    }
  },
  {
    tooltip: '加粗',
    commandName: 'bold',
    icon: '#icon-bold',
    commandHandle: (editor) => setFormat(editor,path=>(path.node.formats.bold = !path.node.formats.bold)),
  },
  {
    tooltip: '下划线',
    commandName: 'underline',
    icon: '#icon-underline',
    commandHandle: (editor) => setFormat(editor,path=>(path.node.formats.underline = !path.node.formats.underline)),
  },
  {
    tooltip: '删除线',
    commandName: 'deleteline',
    icon: '#icon-del',
    commandHandle: (editor) => setFormat(editor,path=>(path.node.formats.deleteline = !path.node.formats.deleteline)),
  },
  {
    tooltip: '背景填充',
    commandName: 'background',
    icon: '#icon-fill',
    options:{}
  },
  {
    tooltip: '左对齐',
    commandName: 'leftAligned',
    icon: '#icon-align-left',
  },
  {
    tooltip: '居中',
    commandName: 'middleAligned',
    icon: '#icon-align-middle',
  },
  {
    tooltip: '右对齐',
    commandName: 'rightAligned',
    icon: '#icon-align-right',
  },
  {
    tooltip: '超链接',
    commandName: 'link',
    icon: '#icon-link',
  },
  {
    tooltip: '图片',
    commandName: 'img',
    icon: '#icon-img',
  },
  {
    tooltip: '代码段',
    commandName: 'code',
    icon: '#icon-code',
  },
  {
    tooltip: 'markdown',
    commandName: 'markdown',
    icon: '#icon-markdown',
  },
  {
    tooltip: '视频',
    commandName: 'radio',
    icon: '#icon-radio',
  },
  {
    tooltip: '清除样式',
    commandName: 'clearStyle',
    icon: '#icon-clear-style',
    commandHandle: (editor) => setFormat(editor,path=>(path.node.formats = {})),
  },
]

// 加入定时器是为了避免table被jsdoc重写
setTimeout(() => {
  window.editor = createEditor({
    data: 'hello world',
  })
    .setToolBar(toolBar)
    .mount('editor-root')
}, 0)
