/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:35
 */
import { Content } from '@/core'
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
        commonPath.deleteData(endOffset, 1)
        if (this.contentLength === 0) {
          console.log(0)
          // 块级内容特殊处理 清空了光标还会停留在块内
          range.setStart(commonPath, 0)
        } else if (commonPath.len === 0) {
          this.caretLeave(commonPath, range, 'left')
          commonPath.delete()
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevSibling = this.getPrevLeafPath(commonPath)
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        if (prevSibling) {
          prevSibling.component.caretEnter(prevSibling, range, 'right')
        }
      }
      range.collapse(true)
    } else {
      startContainer.deleteData(startContainer.len, startContainer.len - startOffset)
      endContainer.deleteData(endOffset, endOffset)
      range.collapse(true)
      commonPath.deleteBetween(startContainer, endContainer)
    }
    this.update(commonPath, range)
  }
}
