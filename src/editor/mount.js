/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-23 13:37:19
 */
import { createVnode as h, patch } from '@/core'
import { initIntercept } from '@/platform'
import formater from './formats'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot(editor) {
  return <div id='editor-root'>{formater.render([editor.$path])}</div>
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
export default function mount(id) {
  this.ui.body = document.getElementById(id)
  initIntercept(this)
  formater.editor = this
  const vn = renderRoot(this, h)
  patch(vn, this.ui.body)
}
