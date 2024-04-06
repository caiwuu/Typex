/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:21:18
 */
import { createVnode as h, patch } from '@typex/core'
import ToolBar from './toolBar'
/**
 * @desc: 渲染根节点
 * @param {*} h
 * @return {*}
 */
function renderRoot (editor) {
  return (
    <div class='editor-wrappe'>
      <ToolBar tools={[...editor.toolBarOptions]} editor={editor}></ToolBar>
      {editor.renderContent(h)}
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
  document.getElementById(id).appendChild(patch(renderRoot(this, h)))
  return this
}