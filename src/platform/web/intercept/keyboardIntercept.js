import { setStyle, multiplication } from '../utils'
export default class KeyboardIntercept {
  input = null
  constructor(editor) {
    this.editor = editor
    this._initIframe()
    this._initInput()
    this._initEvent()
  }
  _initIframe() {
    this.iframe = document.createElement('iframe')
    this.iframe.classList.add('custom-input-iframe')
    this.editor.contentRef.current.appendChild(this.iframe)
  }
  _initInput() {
    const iframedocument = this.iframe.contentDocument
    this.input = iframedocument.createElement('input')
    this.input.classList.add('custom-input')
    iframedocument.body.appendChild(this.input)
  }
  focus(range) {
    range = range || this.editor.selection.getRangeAt(0)
    if (!range) return
    let elm = range.startContainer.elm
    if (!(elm instanceof Element)) {
      elm = elm.parentNode
    }
    const copyStyle = getComputedStyle(elm)
    const height = multiplication(copyStyle.fontSize, 1)
    const style = {
      position: 'absolute',
      top: range.caret.rect.y + height / 1 + 'px',
      left: range.caret.rect.x + 'px',
    }
    setStyle(this.iframe, style)
    this.input.focus()
  }
  destroy() {
    this.input.removeEventListener('compositionstart', this._inputEvent.bind(this))
    this.input.removeEventListener('compositionend', this._inputEvent.bind(this))
    this.input.removeEventListener('input', this._inputEvent.bind(this))
    this.iframe.contentDocument.removeEventListener('keydown', this._handGolobalKeydown.bind(this))
    this.iframe.contentDocument.removeEventListener('keyup', this._handGolobalKeydown.bind(this))
  }
  _initEvent() {
    this.input.addEventListener('compositionstart', this._inputEvent.bind(this))
    this.input.addEventListener('compositionend', this._inputEvent.bind(this))
    this.input.addEventListener('input', this._inputEvent.bind(this))
    this.iframe.contentDocument.addEventListener('keydown', this._handGolobalKeydown.bind(this))
    this.iframe.contentDocument.addEventListener('keyup', this._handGolobalKeydown.bind(this))
  }
  _handGolobalKeydown(event) {
    this.editor.emit('keyboardEvents', event)
  }
  _inputEvent(event) {
    this.editor.emit('keyboardEvents', event)
  }
}
