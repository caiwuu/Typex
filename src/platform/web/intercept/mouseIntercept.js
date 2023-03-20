/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-13 14:58:55
 */
const nativeSelection = document.getSelection()
export default class MouseIntercept {
  constructor(editor) {
    this.editor = editor
    this._addListeners()
  }
  destroy() {
    this.editor.ui.content.removeEventListener('mouseup', this._handMouseup.bind(this))
    this.editor.ui.content.removeEventListener('mousedown', this._handMousedown.bind(this))
  }
  _addListeners() {
    this.editor.ui.content.addEventListener('mouseup', this._handMouseup.bind(this))
    this.editor.ui.content.addEventListener('mousedown', this._handMousedown.bind(this))
  }
  _handMousedown(event) {
    this.editor.emit('mouseEvents', event)
    // 没按shift的时候按下左键折叠选区
    if (!event.shiftKey && event.button === 0) {
      const count = nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      this.editor.selection.updateRanges(event.altKey)
    }
  }
  _handMouseup(event) {
    // 有选区或者按了shift,更新选区（isCollapsed这里必须使用原生的，因为内核的选区此时还未更新）
    if (!nativeSelection.collapsed || event.shiftKey) {
      this.editor.selection.updateRanges(event.altKey)
    }
    this.editor.focus()
  }
}
