/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 14:51:36
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
          // debugger
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
  // onBackspace(path, range) {
  //   const startOffset = range.startOffset
  //   if (startOffset > 0) {
  //     path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
  //     if (!this.contentLength) {
  //       const $root = this.getBlockRoot()
  //       path.delete()
  //       range.setStart($root, 0)
  //     } else if (path.node.data === '') {
  //       const prev = this.getPrevPath(path)?.lastLeaf
  //       path.delete()
  //       if (prev) {
  //         range.setStart(prev, prev.node.data.length)
  //       }
  //     } else {
  //       range.startOffset -= 1
  //     }
  //   } else {
  //     const prev = this.getPrevPath(path)?.lastLeaf
  //     if (prev) {
  //       range.setStart(prev, prev.node.data.length)
  //     }
  //   }
  //   range.collapse(true)
  //   this.update(path, range)
  // }
}
