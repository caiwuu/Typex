/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-14 16:55:56
 */
import { Caret } from '@/platform'

export default class Range {
  // 输入暂存区
  inputState = {
    value: '',
    isComposing: false,
  }
  d = 0
  constructor(nativeRange, editor) {
    const { startContainer, endContainer, startOffset, endOffset, d } = nativeRange
    this.endContainer = endContainer
    this.startContainer = startContainer
    this.endOffset = endOffset
    this.startOffset = startOffset
    this.editor = editor
    this.d = d
    this.caret = new Caret(this)
  }
  get collapsed () {
    return this.endContainer === this.startContainer && this.endOffset === this.startOffset
  }
  get offset () {
    return this.d === 1 ? this.endOffset : this.startOffset
  }
  get container () {
    return this.d === 1 ? this.endContainer : this.startContainer
  }
  set offset (offset) {
    if (this.d === 1) {
      this.endOffset = offset
    } else {
      this.startOffset = offset
    }
    if (this.collapsed) this.d = 0
  }
  set container (container) {
    if (this.d === 1) {
      this.endContainer = container
    } else {
      this.startContainer = container
    }
  }
  set (container, offset) {
    this.container = container
    this.offset = offset
    if (this.collapsed) this.d = 0
  }
  setEnd (endContainer, endOffset) {
    this.endContainer = endContainer
    this.endOffset = endOffset
    if (this.collapsed) this.d = 0
  }
  setStart (startContainer, startOffset) {
    this.startContainer = startContainer
    this.startOffset = startOffset
    if (this.collapsed) this.d = 0
  }
  collapse (toStart) {
    if (toStart) {
      this.endContainer = this.startContainer
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this.startContainer = this.endContainer
    }
    this.d = 0
    this.editor.selection.drawRangeBg()
  }
  updateCaret (drawCaret = true) {
    this.caret.update(this, drawCaret)
    this.editor.focus()
  }
  remove () {
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
