/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-13 14:58:55
 */
import { throttle } from '../utils'
const nativeSelection = document.getSelection()
export default class MouseIntercept {
  selectionchangeHandle = throttle(() => {
    this.editor.emit('selectionchange')
  }, 500)
  handMousedown (event) {
    this.editor.emit('mouseEvents', event)
    // 没按shift的时候按下左键折叠选区
    if (!event.shiftKey && event.button === 0) {
      const count = nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      this.editor.selection.updateRangesFromNative(event.altKey)
    }
  }
  handMouseup (event) {
    // 有选区或者按了shift,更新选区（isCollapsed这里必须使用原生的，因为内核的选区此时还未更新）
    if (!nativeSelection.collapsed || event.shiftKey) {
      this.editor.selection.updateRangesFromNative(event.altKey)
    }
    this.editor.focus()
  }
  constructor(editor) {
    this.editor = editor
    this.addListeners()
  }
  destroy () {
    this.editor.contentRef.current.removeEventListener('mouseup', this.handMouseup.bind(this))
    this.editor.contentRef.current.removeEventListener('mousedown', this.handMousedown.bind(this))
    document.removeEventListener('selectionchange', this.selectionchangeHandle)
  }
  addListeners () {
    this.editor.contentRef.current.addEventListener('mouseup', this.handMouseup.bind(this))
    this.editor.contentRef.current.addEventListener('mousedown', this.handMousedown.bind(this))
    document.addEventListener('selectionchange', this.selectionchangeHandle)
  }
}
