import { Caret } from '@/platform'
export default class Range {
  // 输入状态
  inputState = {
    value: '',
    isComposing: false,
  }
  _d = 0
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
  get endContainer () {
    return this._endContainer.elm || this._endContainer
  }
  set endContainer (value) {
    this._endContainer = value
  }
  get startContainer () {
    return this._startContainer.elm || this._startContainer
  }
  set startContainer (value) {
    this._startContainer = value
  }
  get collapsed () {
    return this.endContainer === this.startContainer && this.endOffset === this.startOffset
  }
  setEnd (endContainer, endOffset) {
    this._endContainer = endContainer
    this.endOffset = endOffset
  }
  setStart (startContainer, startOffset) {
    this._startContainer = startContainer
    this.startOffset = startOffset
  }
  collapse (toStart) {
    if (toStart) {
      this._endContainer = this._startContainer
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this._startContainer = this._endContainer
    }
    this._d = 0
    this.editor.selection.drawRangeBg()
  }
  updateCaret (drawCaret = true) {
    this.caret.update(this, drawCaret)
  }
  remove () {
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
