/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:04:29
 */
import { Content, getVnOrIns, getVnOrElm } from '@/core'
export default class Block extends Content {
  /**
   * @desc: 获取块级根节点
   * @return {*}
   */
  getBlockRoot() {
    if (this.state._$root) return this.state._$root.current
    return getVnOrElm(getVnOrIns(this))
  }
  /**
   * @desc: 删除动作
   * @param {*} path
   * @param {*} range
   * @param {*} editor
   * @return {*}
   */
  onBackspace(path, range, editor) {
    const startOffset = range.startOffset
    if (startOffset > 0) {
      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      if (!this.contentLength) {
        const $root = this.getBlockRoot()
        path.delete()
        range.setStart($root, 0)
      } else if (path.node.data === '') {
        const prev = this.getPrevPath(path)?.lastLeaf
        path.delete()
        if (prev) {
          range.setStart(prev, prev.node.data.length)
        }
      } else {
        range.startOffset -= 1
      }
    } else {
      const prev = this.getPrevPath(path)?.lastLeaf
      if (prev) {
        range.setStart(prev, prev.node.data.length)
      }
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
}
