import plugins from '@/core/plugins'
import Range from './range'
export default class Selection {
  ranges = []
  nativeSelection = plugins.platform.nativeSelection
  constructor(editor) {
    this.editor = editor
  }
  get isCollapsed () {
    return this.ranges.every((range) => range.collapsed)
  }
  get rangeCount () {
    return this.ranges.length
  }
  get rangePoints () {
    const points = []
    this.ranges.forEach((range) => {
      points.push(
        {
          container: range.startContainer,
          offset: range.startOffset,
          range,
          pointName: 'start',
        },
        {
          container: range.endContainer,
          offset: range.endOffset,
          range,
          pointName: 'end',
        }
      )
    })
    return points
  }
  clearRanges () {
    while (this.ranges.length) {
      this.ranges.pop().caret.remove()
    }
  }
  createRange (ops) {
    return new Range(ops, this.editor)
  }
  createRangeFromNativeRange (nativeRange) {
    const { startContainer, endContainer, startOffset, endOffset, collapsed } = nativeRange
    const { focusNode, focusOffset } = this.nativeSelection
    let d = 0
    if (collapsed) {
      d = 0
    } else if (focusNode === endContainer && focusOffset === endOffset) {
      d = 1
    } else {
      d = -1
    }
    return this.createRange({
      startContainer: this._queryPath(startContainer),
      endContainer: this._queryPath(endContainer),
      startOffset,
      endOffset,
      d,
    })
  }
  addRange (range) {
    this.ranges.push(range)
  }
  collapse (parentNode, offset) {
    this.nativeSelection.collapse(parentNode, offset)
    this._resetRangesFromNative()
  }
  _queryPath (elm) {
    const path = this.editor.queryPath(elm)
    if (path) return path
    return this._queryPath(elm.parentNode)
  }
  // 选区转化,矫正鼠标点击的落点
  _transformRange (nativeRange) {
    const { startContainer, endContainer, startOffset, endOffset } = nativeRange
    const startPath = this.editor.queryPath(startContainer)
    const endPath = this.editor.queryPath(endContainer)
    if (!startPath) {
      const path = this._queryPath(startContainer)
      nativeRange.setStart(path.elm, startOffset)
    }
    if (!endPath) {
      const path = this._queryPath(endContainer)
      nativeRange.setStart(path.elm, endOffset)
    }
    return nativeRange
  }
  // 从native重新设置选区
  _resetRangesFromNative () {
    this.clearRanges()
    const count = this.nativeSelection.rangeCount
    for (let i = 0; i < count; i++) {
      const nativeRange = this._transformRange(this.nativeSelection.getRangeAt(i))
      if (!nativeRange) return
      this.addRange(this.createRangeFromNativeRange(nativeRange))
    }
  }
  // 从native选区扩增，多选区支持
  _extendRangesFromNative () {
    const count = this.nativeSelection.rangeCount
    if (count > 0) {
      const nativeRange = this._transformRange(this.nativeSelection.getRangeAt(count - 1))
      if (!nativeRange) return
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
      this.addRange(this.createRangeFromNativeRange(nativeRange))
    }
  }
  getRangeAt (index = 0) {
    return this.ranges[index]
  }
  removeAllRanges () {
    this.nativeSelection.removeAllRanges()
    this.clearRanges()
  }
  createNativeRange ({ startContainer, startOffset, endContainer, endOffset }) {
    const range = document.createRange()
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)
    return range
  }
  /**
   * 在指定容器指定位置发生内容平移，该位置右侧的range锚点需要跟随平移
   * @param {*} container 容器
   * @param {*} position 位置
   * @param {*} distance 平移距离 负左正右
   */
  updatePoints (container, position, distance, newContainer) {
    this.rangePoints.forEach((point) => {
      if (point.container === container && position <= point.offset) {
        point.range[point.pointName + 'Offset'] += distance
        if (newContainer) point.range[point.pointName + 'Container'] = newContainer
      }
    })
  }
  /**
   * range更新 追加ranges或者重新设置ranges
   * @param {*} multiple
   */
  updateRanges (multiple) {
    // 选区的创建结果需要在宏任务中获取.
    setTimeout(() => {
      if (multiple) {
        // 不清除ranges，从nativeSelection增加ranges
        this._extendRangesFromNative()
      } else {
        // 清除ranges,再从nativeSelection同步ranges
        this._resetRangesFromNative()
      }
      this.updateCaret()
    })
  }
  /**
   * 光标视图更新
   * @param {*} drawCaret
   */
  updateCaret (drawCaret = true) {
    this.ranges.forEach((range) => range.updateCaret(drawCaret))
    this.rangeCount > 1 && this.distinct()
    drawCaret && this.drawRangeBg()
  }
  _isCoverd (rectA, rectB) {
    return rectA.y < rectB.y
      ? rectA.y + rectA.height >= rectB.y + rectB.height
      : rectB.y + rectB.height >= rectA.y + rectA.height
  }
  // 光标高性能去重;
  distinct () {
    let tempObj = {}
    let len = this.ranges.length
    if (len < 2) return
    for (let index = 0; index < len; index++) {
      const range = this.ranges[index]
      const path = this.editor.queryPath(range.startContainer)
      const key = `${path.position}-${range.caret.rect.x}-${range.caret.rect.y}`
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
  // 默认以第一个range同步到native来绘制拖蓝
  drawRangeBg (range) {
    const currRange = range || this.getRangeAt(0)
    if (!currRange) return
    this.nativeSelection.removeAllRanges()
    const { startContainer, startOffset, endContainer, endOffset } = currRange
    const createNativeRangeOps = {
      startContainer: startContainer.elm,
      endContainer: endContainer.elm,
      startOffset,
      endOffset,
    }
    this.nativeSelection.addRange(this.createNativeRange(createNativeRangeOps))
  }
}
