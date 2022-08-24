import { nativeSelection } from '@/platform'
import Range from './range'
export default class Selection {
  ranges = []
  nativeSelection = nativeSelection
  constructor(editor) {
    this.editor = editor
  }
  get rangeCount() {
    return this.ranges.length
  }
  get rangePoints() {
    const points = []
    this.ranges.forEach((range) => {
      points.push(
        {
          container: range.startContainer,
          offset: range.startOffset,
          range,
          flag: 'start',
        },
        {
          container: range.endContainer,
          offset: range.endOffset,
          range,
          flag: 'end',
        }
      )
    })
    return points
  }
  _resetRanges() {
    this.clearRanges()
    const count = nativeSelection.rangeCount
    for (let i = 0; i < count; i++) {
      const nativeRange = nativeSelection.getRangeAt(i)
      this.pushRange(nativeRange)
    }
  }
  clearRanges() {
    while (this.ranges.length) {
      this.ranges.pop().caret.remove()
    }
  }
  pushRange(nativeRange) {
    const { focusNode, focusOffset } = nativeSelection
    const cloneRange = new Range(nativeRange, this.editor)
    if (cloneRange.collapsed) {
      cloneRange.d = 0
    } else if (focusNode === cloneRange.endContainer && focusOffset === cloneRange.endOffset) {
      cloneRange.d = 1
    } else {
      cloneRange.d = -1
    }
    this.ranges.push(cloneRange)
  }
  // 注意chrome不支持多选区,需要在此之前调用 removeAllRanges
  addRange(nativeRange) {
    nativeSelection.addRange(nativeRange)
    this.pushRange(nativeRange)
  }
  collapse(parentNode, offset) {
    nativeSelection.collapse(parentNode, offset)
    this._resetRanges()
  }
  _resetRanges() {
    this.clearRanges()
    const count = nativeSelection.rangeCount
    for (let i = 0; i < count; i++) {
      const nativeRange = nativeSelection.getRangeAt(i)
      this.pushRange(nativeRange)
    }
  }
  getRangeAt(index = 0) {
    return this.ranges[index]
  }
  removeAllRanges() {
    nativeSelection.removeAllRanges()
    this.clearRanges()
  }
  // 多选区支持
  _extendRanges() {
    const count = nativeSelection.rangeCount
    if (count > 0) {
      const nativeRange = nativeSelection.getRangeAt(count - 1)
      let flag = false
      this.ranges.forEach((i) => {
        if (
          i.endContainer === nativeRange.endContainer &&
          i.startOffset === nativeRange.startOffset
        ) {
          flag = true
          i.remove()
        }
      })
      if (flag) return
      this.pushRange(nativeRange)
    }
  }
  createNativeRange({ startContainer, startOffset, endContainer, endOffset }) {
    const range = document.createRange()
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)
    return range
  }
  updateRanges(multiple) {
    // 选区的创建结果需要在宏任务中获取.
    setTimeout(() => {
      if (multiple) {
        this._extendRanges()
      } else {
        this._resetRanges()
      }
      this.ranges.forEach((range) => range.updateCaret())
      this.drawRangeBg()
    })
  }
  _isCoverd(rectA, rectB) {
    return rectA.y < rectB.y
      ? rectA.y + rectA.h >= rectB.y + rectB.h
      : rectB.y + rectB.h >= rectA.y + rectA.h
  }
  // 高性能去重;
  distinct() {
    let tempObj = {}
    let len = this.ranges.length
    for (let index = 0; index < len; index++) {
      const range = this.ranges[index]
      const key = range.startContainer.position + range.caret.rect.x + range.caret.rect.y
      if (!tempObj[key]) {
        // 这里解决当两个光标在同一行又不在同一个节点上却又重合的情况，通常在跨行内节点会出现，这时应该当作重复光标去重
        const covereds = Object.entries(tempObj).filter(
          (item) => range.caret.rect.x === item[1].caret.rect.x
        )
        if (covereds.length === 0) {
          tempObj[key] = range
        } else if (this._isCoverd(range.caret.rect, covereds[0][1].caret.rect)) {
          range.caret.remove()
          this.ranges.splice(index, 1)
          len--
          index--
        } else {
          tempObj[key] = range
        }
      } else {
        range.caret.remove()
        this.ranges.splice(index, 1)
        len--
        index--
      }
    }
    tempObj = null
  }
  drawRangeBg(flag) {
    const currRange = this.ranges[0]
    if (!currRange) return
    nativeSelection.removeAllRanges()
    nativeSelection.addRange(this.createNativeRange(currRange))
  }
}
