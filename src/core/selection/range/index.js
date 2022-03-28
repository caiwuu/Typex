import Caret from './caret'
import { getNextPoint, getPrevPoint } from '../../actions/caret'
function formatPoint(nativeRange) {
  const nr = {
    endVNode: nativeRange.endContainer.vnode,
    startVNode: nativeRange.startContainer.vnode,
    endOffset: nativeRange.endOffset,
    startOffset: nativeRange.startOffset,
  }
  if (!nr.endVNode.isEditable) {
    debugger
    const { node, pos, flag } = getPrevPoint(nativeRange.endContainer.vnode, nativeRange.endOffset)
    if (flag === 404) return
    nr.endVNode = node
    nr.endOffset = pos
  }
  if (!nr.startVNode.isEditable) {
    const { node, pos, flag } = getNextPoint(
      nativeRange.startContainer.vnode,
      nativeRange.startOffset
    )
    if (flag === 404) return
    nr.startVNode = node
    nr.startOffset = pos
  }
  return nr
}
export default class Range {
  inputState = {
    // 输入框状态
    value: '',
    isComposing: false,
  }
  _d = 0
  constructor(nativeRange, editor) {
    const { startVNode, endVNode, startOffset, endOffset } = formatPoint(nativeRange)
    this.endVNode = endVNode
    this.startVNode = startVNode
    this.endOffset = endOffset
    this.startOffset = startOffset
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
    const index = this.editor.selection.ranges.findIndex((i) => i === this)
    this.caret.remove()
    this.editor.selection.ranges.splice(index, 1)
  }
}
