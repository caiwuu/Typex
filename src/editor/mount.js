/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:21:18
 */
import { createVnode as h, patch, createRef } from '@/core'
import formater from './formats'
import ToolBar from './toolBar'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot (editor, contentRef) {
  return (
    <div class='editor-wrappe'>
      <ToolBar tools={[...editor.toolBarOption]}></ToolBar>


      <div id='editor-content' style='position:relative' ref={contentRef}>
        {formater.renderRoot(editor.$path)}
      </div>
    </div>
  )
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
export default function mount (id) {
  this.ui.body = document.getElementById(id)
  const mountDom = document.createElement('div')
  const contentRef = createRef()

  this.ui.body.appendChild(mountDom)
  formater.editor = this

  patch(renderRoot(this, contentRef, h), mountDom)
  this.ui.content = contentRef.current
}
