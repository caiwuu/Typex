import { setStyle, multiplication, throttle } from '../utils'
export default class KeyboardIntercept {
  input = null
  _throttleKeydown = throttle((event) => {
    event?.preventDefault?.()
    this.editor.emit('keyboardEvents', event)
  }, 0)
  constructor(editor) {
    this.editor = editor
    this._initIframe()
    this._initInput()
    this._initEvent()
  }
  _initIframe() {
    this.iframe = document.createElement('iframe')
    this.iframe.classList.add('custom-input-iframe')
    this.editor.ui.content.appendChild(this.iframe)
    const iframedocument = this.iframe.contentDocument
    const style = iframedocument.createElement('style')
    style.innerHTML = `
      .custom-input:focus {
       outline: none;
    }
      .custom-input {
        top: 0;
        left: 0;
        pointer-events: none;
        width: 2px;
        background: transparent;
        border: none;
        padding: 0;
        opacity: 0;
        caret-color: transparent;
        color: transparent;
      }
    `
    iframedocument.head.appendChild(style)
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
    event.preventDefault()
    this._throttleKeydown(event)
  }
  _inputEvent(event) {
    this.editor.emit('keyboardEvents', event)
  }
}
