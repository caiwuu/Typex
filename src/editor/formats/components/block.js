/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:35
 */
import { Content } from '@/core'

const mergeBlock = (o, n, shouldUpdates = []) => {
  const oBlock = o.blockComponent
  if (o.blockComponent !== n.blockComponent) {
    if (n.len === 0) {
      n.component.$editor.selection.rangePoints
        .filter((point) => point.container === n)
        .forEach((point) => {
          if (point.pointName === 'start') {
            point.range.setStart(n.nextLeaf, 0)
          } else {
            point.range.setEnd(n.nextLeaf, 0)
          }
        })
    }
    o.blockComponent.$path.insertChildrenAfter(n)
    oBlock.$path.parent.component.update()
    shouldUpdates.forEach((ins) => {
      ins.component.update()
    })
  }
}
export default class Block extends Content {
  get _type() {
    return 'block'
  }
  /**
   * @desc: 删除动作
   * @param {*} commonPath
   * @param {*} range
   * @return {*}
   */
  onContentDelete(commonPath, range) {
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        // 执行删除
        startContainer.textDelete(endOffset, 1)
        if (this.contentLength === 0) {
          // 对于块级 当执行删除块内容为空时候 将被br填充 此时光标停留在段首
          range.setStart(startContainer, 0)
        } else if (startContainer.len === 0) {
          const { path: prevSibling } = this.onCaretLeave(startContainer, range, 'left')
          if (!prevSibling) return
          if (prevSibling.blockComponent !== startContainer.blockComponent) {
            range.setStart(startContainer, 0)
          } else {
            startContainer.delete()
          }
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const { path: prevSibling } = this.onCaretLeave(startContainer, range, 'left')
        if (!prevSibling) return
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        mergeBlock(startContainer, prevSibling)
      }
    } else if (startContainer === endContainer) {
      startContainer.textDelete(endOffset, endOffset - startOffset)
    } else {
      startContainer.textDelete(startContainer.len, startContainer.len - startOffset)
      endContainer.textDelete(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      mergeBlock(endContainer, startContainer)
    }
    range.collapse(true)
    this.update(commonPath, range)
  }

  onKeydownB(range, event) {
    if (event?.ctrlKey) {
      this.setFormat(range, (f) => {
        f.bold = !f.bold
      })
    }
  }
  onKeydownD(range, event) {
    if (event?.ctrlKey) {
      this.setFormat(range, (f) => {
        f.del = !f.del
      })
    }
  }
  onKeydownS(range, event) {
    if (event?.ctrlKey) {
      this.setFormat(range, (f) => {
        if (event.shiftKey) {
          f.sub = !f.sub
        } else {
          f.sup = !f.sup
        }
      })
    }
  }
  onKeydownU(range, event) {
    if (event?.ctrlKey) {
      this.setFormat(range, (f) => {
        f.underline = !f.underline
      })
    }
  }
}
