/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-19 09:27:43
 */
import { createVnode as h, patch } from '@/core'
import { formater } from './formats'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot(editor) {
  return <div id='editor-root'>{formater.render(editor.$path)}</div>
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
export default function mount(id) {
  formater.editor = this
  const vn = renderRoot(this, h)
  console.log(vn, this.$path)
  patch(vn, document.getElementById(id))
}
