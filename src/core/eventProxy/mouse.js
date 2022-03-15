import { nativeSelection } from '../native'
export default class MouseProxy {
  constructor(editor) {
    this.editor = editor
    this._addListeners()
  }
  destroy() {
    this.editor.ui.body.elm.removeEventListener('mouseup', this._handMouseup.bind(this))
    this.editor.ui.body.elm.removeEventListener('mousedown', this._handMousedown.bind(this))
  }
  _addListeners() {
    this.editor.ui.body.elm.addEventListener('mouseup', this._handMouseup.bind(this))
    this.editor.ui.body.elm.addEventListener('mousedown', this._handMousedown.bind(this))
  }
  _handMousedown(event) {
    if (!event.shiftKey) {
      const count = nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      this.editor.selection.updateRanges(event.altKey)
    }
  }
  _handMouseup(event) {
    // 有选区
    if (!nativeSelection.isCollapsed || event.shiftKey) {
      this.editor.selection.updateRanges(event.altKey)
    }
    this.editor.focus()
  }
}
