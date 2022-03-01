import { setStyle, multiplication } from '../share/utils'
import input from './input'
export default class KeyboardProxy {
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
    this.editor.ui.body.ele.appendChild(this.iframe)
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
  focus() {
    const range = this.editor.selection.getRangeAt(0)
    if (!range) return
    let container = range.startVNode.ele
    if (!(container instanceof Element)) {
      container = container.parentNode
    }
    const copyStyle = getComputedStyle(container)
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
  }
  _initEvent() {
    this.input.addEventListener('compositionstart', this._inputEvent.bind(this))
    this.input.addEventListener('compositionend', this._inputEvent.bind(this))
    this.input.addEventListener('input', this._inputEvent.bind(this))
    this.iframe.contentDocument.addEventListener('keydown', this._handGolobalKeydown.bind(this))
  }
  _inputEvent(event) {
    this.editor.selection.ranges.forEach((range) => {
      input.call(range, event)
    })
    this.editor.selection.ranges.forEach((range) => {
      range.updateCaret()
    })
    this.editor.selection.distinct()
    this.editor.focus()
  }
  _handGolobalKeydown(event) {
    const key = event.key
    switch (key) {
      case 'ArrowRight':
        this.editor.emit('caretMove', 'right', true, event.shiftKey)
        break
      case 'ArrowLeft':
        this.editor.emit('caretMove', 'left', true, event.shiftKey)
        break
      case 'ArrowUp':
        event.preventDefault()
        this.editor.emit('caretMove', 'up', false, event.shiftKey)
        break
      case 'ArrowDown':
        event.preventDefault()
        this.editor.emit('caretMove', 'down', false, event.shiftKey)
        break
      case 'Backspace':
        event.preventDefault()
        // this.editor.selection.del()
        break
      case 'Enter':
        event.preventDefault()
      // this.editor.selection.enter()
    }
  }
}
