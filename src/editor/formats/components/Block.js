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
            console.log(n.nextLeaf)
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
  _type = 'block'
  /**
   * @desc: 删除动作
   * @param {*} commonPath
   * @param {*} range
   * @return {*}
   */
  contentDelete(commonPath, range) {
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        // 执行删除
        startContainer.contentDelete(endOffset, 1)
        if (this.contentLength === 0) {
          // 对于块级 当执行删除块内容为空时候 将被br填充 此时光标停留在段首
          range.setStart(startContainer, 0)
        } else if (startContainer.len === 0) {
          const { path: prevSibling } = this.caretLeave(startContainer, range, 'left')
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
      startContainer.contentDelete(endOffset, endOffset - startOffset)
    } else {
      startContainer.contentDelete(startContainer.len, startContainer.len - startOffset)
      endContainer.contentDelete(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      mergeBlock(endContainer, startContainer)
    }
    range.collapse(true)
    this.update(commonPath, range)
  }
  getSeletedPath(range) {
    let start,
      end,
      value,
      done = false
    if (range.collapsed) {
      done = true
    } else {
      if (range.startOffset === 0) {
        start = range.startContainer
      } else if (range.startOffset === range.startContainer.len) {
        start = range.startContainer.nextLeaf
      } else {
        const startSplits = range.startContainer.split(range.startOffset)
        this.$editor.selection.updatePoints(
          range.startContainer,
          range.startOffset + 1,
          -range.startOffset,
          startSplits[1]
        )
        start = startSplits[1]
      }

      if (range.endOffset === 0) {
        end = range.endContainer.prevLeaf
      } else if (range.endOffset === range.startContainer.len) {
        end = range.startContainer
      } else {
        const endSplits = range.endContainer.split(range.endOffset)
        this.$editor.selection.updatePoints(
          range.endContainer,
          range.endOffset + 1,
          -range.endOffset,
          endSplits[1]
        )
        end = endSplits[0]
      }
    }

    value = start
    return {
      length: 0,
      next: function () {
        if (!done) {
          const res = { value, done }
          done = value === end
          value = value.nextLeaf
          this.length++
          console.log(this)
          return res
        } else {
          return { value: undefined, done }
        }
      },
      [Symbol.iterator]: function () {
        return this
      },
    }
  }
  onKeydownB(range, event) {
    if (event.ctrlKey) {
      event.preventDefault()
      const commonPath = this.$editor.queryCommonPath(range.startContainer, range.endContainer)
      const selectedPath = [...this.getSeletedPath(range)]
      console.log()
      selectedPath.forEach((p) => (p.node.formats.bold = !p.node.formats.bold))
      // if (range.collapsed) {
      //   commonPath.node.formats.bold = !commonPath.node.formats.bold
      // } else {
      //   const startSplits = range.startContainer.split(range.startOffset)
      //   this.$editor.selection.updatePoints(
      //     range.startContainer,
      //     range.startOffset,
      //     -range.startOffset,
      //     startSplits[1]
      //   )
      //   const endSplits = range.endContainer.split(range.endOffset)
      //   this.$editor.selection.updatePoints(
      //     range.endContainer,
      //     range.endOffset,
      //     -range.endOffset,
      //     endSplits[1]
      //   )
      //   let path = range.startContainer
      //   while (path !== range.endContainer) {
      //     path.node.formats.bold = !path.node.formats.bold
      //     path = path.nextLeaf
      //   }
      // }
      commonPath.component.update()
    }
  }
  onKeydownD(range, event) {
    if (event.ctrlKey) {
      event.preventDefault()
      const commonPath = this.$editor.queryCommonPath(range.startContainer, range.endContainer)
      if (range.collapsed) {
        commonPath.node.formats.del = !commonPath.node.formats.del
      } else {
        const startSplits = range.startContainer.split(range.startOffset)
        this.$editor.selection.updatePoints(
          range.startContainer,
          range.startOffset,
          -range.startOffset,
          startSplits[1]
        )
        const endSplits = range.endContainer.split(range.endOffset)
        this.$editor.selection.updatePoints(
          range.endContainer,
          range.endOffset,
          -range.endOffset,
          endSplits[1]
        )
        let path = range.startContainer
        // debugger
        while (path !== range.endContainer) {
          path.node.formats.del = !path.node.formats.del
          path = path.nextLeaf
        }
      }
      commonPath.component.update()
    }
  }
  onKeydownS(range, event) {
    if (event.ctrlKey) {
      event.preventDefault()
      range.container.node.formats.sup = !range.container.node.formats.sup
      range.container.component.update()
    }
  }
  onKeydownU(range, event) {
    event.preventDefault()
    const a = this.getSeletedPath(range)
    window.aaa = a
    console.log(a)
    if (event.ctrlKey) {
      event.preventDefault()
      range.container.node.formats.underline = !range.container.node.formats.underline
      range.container.component.update()
    }
  }
}
