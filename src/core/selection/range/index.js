/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 14:57:01
 */
import { Caret } from '@/platform'
export default class Range {
  // 输入暂存区
  inputState = {
    value: '',
    isComposing: false,
  }
  d = 0
  _endContainer = null
  _startContainer = null
  constructor(nativeRange, editor) {
    const { startContainer, endContainer, startOffset, endOffset } = nativeRange
    this.endContainer = endContainer
    this.startContainer = startContainer
    this.endOffset = endOffset
    this.startOffset = startOffset
    this.editor = editor
    this.caret = new Caret(this)
  }
  get endContainer() {
    return this._endContainer.elm || this._endContainer
  }
  set endContainer(value) {
    this._endContainer = value
  }
  get startContainer() {
    return this._startContainer.elm || this._startContainer
  }
  set startContainer(value) {
    this._startContainer = value
  }
  get collapsed() {
    return this.endContainer === this.startContainer && this.endOffset === this.startOffset
  }
  get offset() {
    return this.d === 1 ? this.endOffset : this.startOffset
  }
  get container() {
    return this.d === 1 ? this.endContainer : this.startContainer
  }
  set offset(offset) {
    if (this.d === 1) {
      this.endOffset = offset
    } else {
      this.startOffset = offset
    }
    if (this.collapsed) this.d = 0
  }
  set container(container) {
    if (this.d === 1) {
      this._endContainer = container
    } else {
      this._startContainer = container
    }
  }
  set(container, offset) {
    this.container = container
    this.offset = offset
    if (this.collapsed) this.d = 0
  }
  setEnd(endContainer, endOffset) {
    this._endContainer = endContainer
    this.endOffset = endOffset
    if (this.collapsed) this.d = 0
  }
  setStart(startContainer, startOffset) {
    this._startContainer = startContainer
    this.startOffset = startOffset
    if (this.collapsed) this.d = 0
  }
  collapse(toStart) {
    if (toStart) {
      this._endContainer = this._startContainer
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this._startContainer = this._endContainer
    }
    this.d = 0
    this.editor.selection.drawRangeBg()
  }
  updateCaret(drawCaret = true) {
    this.caret.update(this, drawCaret)
    this.editor.focus()
  }
  remove() {
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
