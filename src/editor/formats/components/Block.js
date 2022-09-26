/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 14:53:24
 */
import { Content } from '@/core'
export default class Block extends Content {
  _type = 'block'
  /**
   * @desc: 删除动作
   * @param {*} path
   * @param {*} range
   * @return {*}
   */
  onBackspace(path, range) {
    const { endContainer, endOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        path.node.data = path.node.data.slice(0, endOffset - 1) + path.node.data.slice(endOffset)
        if (!this.props.path.len) {
          range.setStart(path, 0)
        } else if (path.node.data === '') {
          const prevSibling = this.getPrevPath(path).lastLeaf
          path.delete()
          if (prevSibling) {
            prevSibling.component.onCaretEnter(prevSibling, range, false)
          }
        } else {
          this.props.editor.selection.updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevSibling = this.getPrevPath(path).lastLeaf
        if (!this.props.path.len) {
          const parent = this.props.path.parent.component
          this.props.path.delete()
          parent.update()
        }
        if (prevSibling) {
          prevSibling.component.onCaretEnter(prevSibling, range, false)
        }
      }
    } else {
      console.log('TODO')
    }
    this.update(path, range)
  }
}
