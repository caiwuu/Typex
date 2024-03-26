/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-14 16:55:56
 */
import pluginContext from '../../pluginContext'

/**
 * @description 选区范围类
 * @class Range
 */
export default class Range {
  // 输入暂存区
  inputState = {
    value: '',
    isComposing: false,
  }

  /**
   * @description 标识range方向
   * @memberof Range
   */
  d = 0
  constructor(PathizationRange, editor) {
    const { startContainer, endContainer, startOffset, endOffset, d } = PathizationRange
    this.endContainer = endContainer
    this.startContainer = startContainer
    this.endOffset = endOffset
    this.startOffset = startOffset
    this.editor = editor
    this.d = d
    this.caret = new pluginContext.platform.Caret(this)
  }

  /**
   * @description 是否折叠
   * @readonly
   * @memberof Range
   * @instance
   */
  get collapsed () {
    return this.endContainer === this.startContainer && this.endOffset === this.startOffset
  }

  /**
   * @description 偏移量
   * @memberof Range
   * @instance
   * @name Range#get:offset
   */
  get offset () {
    return this.d === 1 ? this.endOffset : this.startOffset
  }

  /**
   * @description 容器
   * @memberof Range
   * @instance
   */
  get container () {
    return this.d === 1 ? this.endContainer : this.startContainer
  }

  /**
   * @description 设置偏移量
   * @memberof Range
   * @name Range#set:offset
   * @type {number}
   * @instance
   */
  set offset (offset) {
    if (this.d === 1) {
      this.endOffset = offset
    } else {
      this.startOffset = offset
    }
    if (this.collapsed) this.d = 0
  }

  /**
   * @description 设置容器
   * @memberof Range
   * @instance
   */
  set container (container) {
    if (this.d === 1) {
      this.endContainer = container
    } else {
      this.startContainer = container
    }
  }

  /**
   * @description range快照
   * @readonly
   * @memberof Range
   */
  get snapshot () {
    return {
      endContainer: this.endContainer.position,
      startContainer: this.startContainer.position,
      endOffset: this.endOffset,
      startOffset: this.startOffset,
      d: this.d,
    }
  }

  /**
   * @description 设置容器和偏移量
   * @param {*} container
   * @param {*} offset
   * @memberof Range
   * @instance
   */
  set (container, offset) {
    this.container = container
    this.offset = offset
    if (this.collapsed) this.d = 0
    return this
  }

  /**
   * @description 设置结束端点
   * @param {*} endContainer
   * @param {*} endOffset
   * @memberof Range
   * @instance
   */
  setEnd (endContainer, endOffset) {
    this.endContainer = endContainer
    this.endOffset = endOffset
    if (this.collapsed) this.d = 0
    return this
  }

  /**
   * @description 设置开始端点
   * @param {*} startContainer
   * @param {*} startOffset
   * @memberof Range
   * @instance
   */
  setStart (startContainer, startOffset) {
    this.startContainer = startContainer
    this.startOffset = startOffset
    if (this.collapsed) this.d = 0
    return this
  }

  /**
   * @description 折叠选区范围
   * @param {*} toStart
   * @memberof Range
   * @instance
   */
  collapse (toStart = true) {
    if (toStart) {
      this.endContainer = this.startContainer
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this.startContainer = this.endContainer
    }
    this.d = 0
    return this
  }

  /**
   * @description 更新光标
   * @param {boolean} [drawCaret=true]
   * @memberof Range
   * @instance
   */
  updateCaret (drawCaret = true) {
    this.caret.update(drawCaret)
    // 点击鼠标 输入框消失
    setTimeout(() => {
      this.editor.focus()
    }, 200)
  }

  /**
   * @description 删除选区范围
   * @memberof Range
   * @instance
   */
  remove () {
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
