/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-26 15:22:44
 */
// model 模块功能覆盖测试
import './modelTestDemo/index'
// 编辑器demo
import createEditor from './editor'
import './style.styl'

const toolBar = [
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
    command: 'header',
    icon: '#icon-header',
  },
  {
    tooltip: '字体大小',
    command: 'fontSize',
    icon: '#icon-font-size',
  },
  {
    tooltip: '字体颜色',
    command: 'fontColor',
    icon: '#icon-color',
  },
  {
    tooltip: '加粗',
    command: 'bold',
    icon: '#icon-bold',
    commandHandle: (path) => (path.node.formats.bold = !path.node.formats.bold),
  },
  {
    tooltip: '下划线',
    command: 'underline',
    icon: '#icon-underline',
    commandHandle: (path) => (path.node.formats.underline = !path.node.formats.underline),
  },
  {
    tooltip: '删除线',
    command: 'deleteline',
    icon: '#icon-del',
    commandHandle: (path) => (path.node.formats.del = !path.node.formats.del),
  },
  {
    tooltip: '背景填充',
    command: 'background',
    icon: '#icon-fill',
  },
  {
    tooltip: '左对齐',
    command: 'leftAligned',
    icon: '#icon-align-left',
  },
  {
    tooltip: '居中',
    command: 'middleAligned',
    icon: '#icon-align-middle',
  },
  {
    tooltip: '右对齐',
    command: 'rightAligned',
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
    command: 'clearStyle',
    icon: '#icon-clear-style',
    commandHandle: (path) => (path.node.formats = {}),
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
