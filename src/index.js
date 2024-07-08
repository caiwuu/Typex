/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-26 15:22:44
 */
// 编辑器demo
import createEditor from 'editor'
import './style.styl'
const toolBar = [
  'undo',
  'redo',
  'header',
  'fontSize',
  'color',
  'bold',
  'underline',
  'deleteline',
  'background'
]
// 加入定时器是为了避免table被jsdoc重写
setTimeout(() => {
  window.editor = createEditor({
    data: 'hello world',
  })
    .setToolBar(toolBar)
    .mount('editor-root')
}, 0)
