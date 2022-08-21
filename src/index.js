/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 14:58:36
 */
// model 模块功能覆盖测试
// import './modelTestDemo/index'
// 编辑器demo
import createEditor from './editor'
import './style.styl'
window.editor = createEditor({
  data: 'hello world',
}).mount('editor-root')
