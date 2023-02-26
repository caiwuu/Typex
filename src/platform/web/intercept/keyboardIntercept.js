import { setStyle, multiplication } from '../utils'
export default class KeyboardIntercept {
  input = null
  constructor(editor) {
    this.editor = editor
    this._initIframe()
    this._initInput()
    this._initEvent()
  }
  _initIframe () {
    this.iframe = document.createElement('iframe')
    this.iframe.classList.add('custom-input-iframe')
    this.editor.ui.body.appendChild(this.iframe)
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
  _initInput () {
    const iframedocument = this.iframe.contentDocument
    this.input = iframedocument.createElement('input')
    this.input.classList.add('custom-input')
    iframedocument.body.appendChild(this.input)
  }
  focus (range) {
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
  destroy () {
    this.input.removeEventListener('compositionstart', this._inputEvent.bind(this))
    this.input.removeEventListener('compositionend', this._inputEvent.bind(this))
    this.input.removeEventListener('input', this._inputEvent.bind(this))
    this.iframe.contentDocument.removeEventListener('keydown', this._handGolobalKeydown.bind(this))
  }
  _initEvent () {
    this.input.addEventListener('compositionstart', this._inputEvent.bind(this))
    this.input.addEventListener('compositionend', this._inputEvent.bind(this))
    this.input.addEventListener('input', this._inputEvent.bind(this))
    this.iframe.contentDocument.addEventListener('keydown', this._handGolobalKeydown.bind(this))
  }
  _inputEvent (event) {
    event.key = 'Input'
    this.editor.emit('keyboardEvents', event)
    this.editor.emit('insert', {
      type: event.type,
      data: event.data,
      clear: () => {
        event.target.value = ''
      },
    })
  }
  _handGolobalKeydown (event) {
    this.editor.emit('keyboardEvents', event)
    const key = event.key
    switch (key) {
      case 'ArrowRight':
        this.editor.emit('caretMove', {
          direction: 'right',
          drawCaret: true,
          shiftKey: event.shiftKey,
        })
        break
      case 'ArrowLeft':
        this.editor.emit('caretMove', {
          direction: 'left',
          drawCaret: true,
          shiftKey: event.shiftKey,
        })
        break
      case 'ArrowUp':
        event.preventDefault()
        this.editor.emit('caretMove', {
          direction: 'up',
          drawCaret: true,
          shiftKey: event.shiftKey,
        })
        break
      case 'ArrowDown':
        event.preventDefault()
        this.editor.emit('caretMove', {
          direction: 'down',
          drawCaret: true,
          shiftKey: event.shiftKey,
        })
        break
      case 'Backspace':
        event.preventDefault()
        this.editor.emit('delete')
        break
      case 'Enter':
        event.preventDefault()
      // this.editor.selection.enter()
    }
  }
}
