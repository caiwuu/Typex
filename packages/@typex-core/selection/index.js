import pluginContext from '../pluginContext'
import Range from './range'

/**
 * @description 选区类
 * @export
 * @class Selection
 */
export default class Selection {
  ranges = []
  nativeSelection = pluginContext.platform.nativeSelection
  constructor(editor) {
    this.editor = editor
  }

  /**
   * @description 选区是否折叠
   * @readonly
   * @memberof Selection
   * @instance
   */
  get collapsed() {
    return this.ranges.every((range) => range.collapsed)
  }

  /**
   * @description 选区范围数量
   * @readonly
   * @memberof Selection
   * @instance
   */
  get rangeCount() {
    return this.ranges.length
  }

  /**
   * @description 选区端点list
   * @readonly
   * @memberof Selection
   * @instance
   */
  get rangePoints() {
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
  get rangesSnapshot() {
    return this.ranges.map((range) => range.snapshot)
  }

  /**
   * @description 清除范围选区
   * @memberof Selection
   * @instance
   */
  clearRanges() {
    while (this.ranges.length) {
      this.ranges.pop().caret.remove()
    }
  }

  /**
   * @description 创建range
   * @param {*} ops
   * @returns {*}
   * @memberof Selection
   * @instance
   */
  createRange(ops) {
    return new Range(ops, this.editor)
  }

  /**
   * @description 从原生range创建range
   * @param {*} nativeRange
   * @returns {*}
   * @memberof Selection
   * @instance
   */
  createRangeFromNativeRange(nativeRange) {
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
      startContainer: this.amendPathOffset(startContainer).path,
      endContainer: this.amendPathOffset(endContainer).path,
      startOffset,
      endOffset,
      d,
    })
  }

  /**
   * @description 增加range
   * @param {*} range
   * @memberof Selection
   * @instance
   */
  addRange(range) {
    this.ranges.push(range)
  }

  /**
   * @description 折叠选区
   * @param {*} parentNode
   * @param {*} offset
   * @memberof Selection
   * @instance
   */
  collapse(parentNode, offset) {
    this.nativeSelection.collapse(parentNode, offset)
    this._resetRangesFromNative()
  }

  /**
   * @description 路径查询
   * @param {*} elm
   * @returns {*}
   * @memberof Selection
   * @ignore
   * @instance
   */
  amendPathOffset(container, offset) {
    const path = this.editor.queryPath(container)
    if (path) {
      if (path.isLeaf && path.pathType !== 3) {
        return this.amendPathOffset(path.elm.parentNode, path.index + 1)
      }
      return { path, offset }
    } else {
      return this.amendPathOffset(container.parentNode, offset)
    }
  }

  /**
   * @description 选区转化,修正鼠标点击的落点
   * @param {*} nativeRange
   * @returns {*}
   * @memberof Selection
   * @ignore
   * @instance
   */
  amendRange(nativeRange) {
    const { startContainer, endContainer, startOffset, endOffset } = nativeRange
    const startPathOffset = this.amendPathOffset(startContainer, startOffset)
    const endPathOffset = this.amendPathOffset(endContainer, endOffset)
    nativeRange.setStart(startPathOffset.path.elm, startPathOffset.offset)
    nativeRange.setEnd(endPathOffset.path.elm, endPathOffset.offset)
    return nativeRange
  }

  /**
   * @description 从native重新设置选区
   * @memberof Selection
   * @ignore
   * @private
   * @instance
   */
  _resetRangesFromNative() {
    this.clearRanges()
    const count = this.nativeSelection.rangeCount
    for (let i = 0; i < count; i++) {
      const nativeRange = this.amendRange(this.nativeSelection.getRangeAt(i))
      if (!nativeRange) return
      this.addRange(this.createRangeFromNativeRange(nativeRange))
    }
  }

  /**
   * @description 从native选区扩增，多选区支持
   * @memberof Selection
   * @ignore
   * @instance
   */
  _extendRangesFromNative() {
    const count = this.nativeSelection.rangeCount
    if (count > 0) {
      const nativeRange = this.amendRange(this.nativeSelection.getRangeAt(count - 1))
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

  /**
   * @description 获取第index个range
   * @param {number} [index=0]
   * @returns {*}
   * @memberof Selection
   * @instance
   */
  getRangeAt(index = 0) {
    return this.ranges[index]
  }

  /**
   * @description 移除range并且清除原生range
   * @memberof Selection
   * @instance
   */
  removeAllRanges() {
    this.nativeSelection.removeAllRanges()
    this.clearRanges()
  }

  /**
   * @description 创建原生range
   * @param {*} { startContainer, startOffset, endContainer, endOffset }
   * @returns {*}
   * @memberof Selection
   * @instance
   */
  createNativeRange({ startContainer, startOffset, endContainer, endOffset }) {
    const range = document.createRange()
    range.setStart(startContainer, startOffset)
    range.setEnd(endContainer, endOffset)
    return range
  }

  /**
   * @description 在指定容器指定位置发生内容平移，该位置右侧的range锚点需要跟随平移
   * @param {*} container 目标容器
   * @param {*} position 位置
   * @param {*} distance 平移距离,负左正右
   * @param {*} newContainer 设置新容器
   * @memberof Selection
   * @instance
   */
  updatePoints(container, position, distance, newContainer) {
    this.rangePoints.forEach((point) => {
      if (point.container === container && position <= point.offset) {
        point.range[point.pointName + 'Offset'] += distance
        if (newContainer) point.range[point.pointName + 'Container'] = newContainer
      }
    })
  }

  /**
   * @description range更新 追加ranges或者重新设置ranges
   * @param {*} multiple
   * @memberof Selection
   * @instance
   */
  updateRangesFromNative(multiple) {
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
   * @description 光标视图更新
   * @param {boolean} [drawCaret=true]
   * @memberof Selection
   * @instance
   */
  updateCaret(drawCaret = true) {
    this.ranges.forEach((range) => range.updateCaret(drawCaret))
    this.rangeCount > 1 && this._distinct()
    drawCaret && this.drawRangeBg()
  }

  /**
   * @description 检查光标是否重叠
   * @param {*} rectA
   * @param {*} rectB
   * @returns {*}  {boolean}
   * @memberof Selection
   * @instance
   * @ignore
   */
  _isCoverd(rectA, rectB) {
    return rectA.y < rectB.y
      ? rectA.y + rectA.height >= rectB.y + rectB.height
      : rectB.y + rectB.height >= rectA.y + rectA.height
  }

  /**
   * @description 光标高性能去重
   * @memberof Selection
   * @ignore
   * @instance
   */
  _distinct() {
    let tempObj = {}
    let length = this.ranges.length
    if (length < 2) return
    for (let index = 0; index < length; index++) {
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
          length--
          index--
        } else {
          tempObj[key] = range
        }
      } else {
        range.caret.remove()
        this.ranges.splice(index, 1)
        length--
        index--
      }
    }
    tempObj = null
  }

  /**
   * @description 默认以第一个range同步到native来绘制拖蓝
   * @param {*} range
   * @memberof Selection
   * @instance
   */
  drawRangeBg(range) {
    const currRange = range || this.getRangeAt(0)
    if (!currRange) return
    const { startContainer, startOffset, endContainer, endOffset } = currRange
    this.nativeSelection.removeAllRanges()
    const createNativeRangeOps = {
      startContainer: startContainer.elm,
      endContainer: endContainer.elm,
      startOffset,
      endOffset,
    }
    this.nativeSelection.addRange(this.createNativeRange(createNativeRangeOps))
  }
  /**
   * @description 获取选中的叶子节点迭代器
   * @returns {Iterator} 迭代器
   * @memberof Selection
   * @instance
   */
  getSeletedPath() {
    if (this.collapsed) return []
    const range = this.ranges[0]
    let start,
      end,
      value,
      done = false
    if (range.collapsed) {
      done = true
    } else {
      if (range.startOffset === 0) {
        start = range.startContainer
      } else if (range.startOffset === range.startContainer.length) {
        start = range.startContainer.nextLeaf
      } else {
        const startSplits = range.startContainer.split(range.startOffset)
        this.updatePoints(
          range.startContainer,
          range.startOffset,
          -range.startOffset,
          startSplits[1]
        )
        start = startSplits[1]
      }

      if (range.endOffset === 0) {
        end = range.endContainer.prevLeaf
      } else if (range.endOffset === range.endContainer.length) {
        end = range.endContainer
      } else {
        const endSplits = range.endContainer.split(range.endOffset)
        this.updatePoints(range.endContainer, range.endOffset + 1, -range.endOffset, endSplits[1])
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
  recoverRangesFromSnapshot(rangesSnapshot) {
    this.removeAllRanges()
    this.ranges = rangesSnapshot.map((jsonRange) =>
      this.createRange({
        startContainer: this.editor.queryPath(jsonRange.startContainer),
        endContainer: this.editor.queryPath(jsonRange.endContainer),
        startOffset: jsonRange.startOffset,
        endOffset: jsonRange.endOffset,
        d: jsonRange.d,
      })
    )
    this.updateCaret()
  }
}
