/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-12 10:51:44
 */
import { createVnode as h, patch, createPath, formater } from '@/core'
import { mockData } from './data'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot(h) {
  return <div id='editor-root'>{formater.render([mockData])}</div>
}
/**
 * @desc: 挂载
 * @param {*} id
 * @param {*} editor
 * @return {*}
 */
function mountContent(id, editor) {
  injectEditor(editor)
  editor.data = mockData
  editor.path = createPath(mockData)
  createPath(mockData)
  patch(renderRoot(h), document.getElementById(id))
}
function injectEditor(editor) {
  formater.editor = editor
}
export { mountContent }
