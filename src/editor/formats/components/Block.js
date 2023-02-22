/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:35
 */
import { Content } from '@/core'
const mergeBlock = (o, n, shouldUpdates = []) => {
  debugger
  const oBlock = o.blockComponent
  if (o.blockComponent !== n.blockComponent) {
    o.blockComponent.$path.insertChildrenAfter(n)
    oBlock.$path.parent.component.update()
    shouldUpdates.forEach((ins) => {
      ins.component.update()
    })
  }
}
export default class Block extends Content {
  _type = 'block'
  /**
   * @desc: 删除动作
   * @param {*} commonPath
   * @param {*} range
   * @return {*}
   */
  deleteData(commonPath, range) {
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        // 执行删除
        startContainer.deleteData(endOffset, 1)
        if (this.contentLength === 0) {
          // 对于块级 当执行删除块内容为空时候 将被br填充 此时光标停留在段首
          range.setStart(startContainer, 0)
        } else if (startContainer.len === 0) {
          const { path: prevSibling } = this.caretLeave(startContainer, range, 'left')
          startContainer.delete()
          mergeBlock(startContainer, prevSibling)
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const { path: prevSibling } = this.caretLeave(startContainer, range, 'left')
        if (!prevSibling) return
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        mergeBlock(startContainer, prevSibling)
      }
    } else if (startContainer === endContainer) {
      startContainer.deleteData(endOffset, endOffset - startOffset)
    } else {
      startContainer.deleteData(startContainer.len, startContainer.len - startOffset)
      endContainer.deleteData(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      mergeBlock(endContainer, startContainer)
    }
    range.collapse(true)
    this.update(commonPath, range)
  }
}
