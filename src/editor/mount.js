/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-12 10:51:44
 */
import { createVnode as h, patch } from '@/core'
import { formater } from './formats'
import { mockData } from './data'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot(editor, h) {
  return <div id='editor-root'>{formater.render([editor.$marks])}</div>
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
export default function mount(id) {
  formater.editor = this
  patch(renderRoot(this, h), document.getElementById(id))
}
