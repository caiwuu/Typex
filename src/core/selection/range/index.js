import Caret from './caret'
export default class Range {
  inputState = {
    // 输入框状态
    value: '',
    isComposing: false,
  }
  _d = 0
  collapsed = true
  constructor(nativeRange, editor) {
    this.endVNode = nativeRange.endContainer.vnode
    this.startVNode = nativeRange.startContainer.vnode
    this.endOffset = nativeRange.endOffset
    this.startOffset = nativeRange.startOffset
    this.editor = editor
    this.caret = new Caret(this)
  }
  get collapsed() {
    return this.endVNode === this.startVNode && this.endOffset === this.startOffset
  }
  setEnd(endVNode, endOffset) {
    this.endVNode = endVNode
    this.endOffset = endOffset
  }
  setStart(startVNode, startOffset) {
    this.startVNode = startVNode
    this.startOffset = startOffset
  }
  collapse(toStart) {
    if (toStart) {
      this.endVNode = this.startVNode
      this.endOffset = this.startOffset
    } else {
      this.startOffset = this.endOffset
      this.startVNode = this.endVNode
    }
  }
  updateCaret(drawCaret = true) {
    this.caret.update(this, drawCaret)
  }
  remove() {
    const index = this.vm.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.vm.selection.ranges.splice(index, 1)
  }
}
