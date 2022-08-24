import { multiplication } from './utils'
const setStyle = (dom, style) => {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}
const defaultStyle = {}
export default class Caret {
  dom = null
  rect = null
  constructor(range) {
    this.range = range
    this.measure = new Measure()
    this.dom = document.createElement('span')
    this.dom.classList.add('custom-caret')
    this.setStyle(this.dom)
  }
  setStyle(style = {}) {
    const mergeStyle = Object.assign({}, defaultStyle, style)
    setStyle(this.dom, mergeStyle)
  }
  remove() {
    this.dom.remove()
  }
  getRect(range) {
    return this.measure.measure(range.container, range.offset)
  }
  update(range, drawCaret = true) {
    this.rect = this.getRect(range)
    if (!drawCaret) return
    range.editor.ui.body.appendChild(this.dom)
    let container = range.startContainer
    if (!container) return
    if (!(container instanceof Element)) {
      container = container.parentNode
    }
    const copyStyle = getComputedStyle(container)
    const caretStyle = {
      top: this.rect.y + 1 + 'px',
      // 光标宽度为2
      left: this.rect.x - 1 + 'px',
      height: this.rect.h + 'px',
      fontSize: copyStyle.fontSize,
      background: copyStyle.color,
      display: range.collapsed ? 'inline-block' : 'none',
    }
    this.setStyle(caretStyle)
  }
}

class Measure {
  dom = null
  instance = null
  constructor() {
    if (!Measure.instance) {
      this.dom = document.createElement('text')
      Measure.instance = this
    } else {
      return Measure.instance
    }
  }
  measure(container, offset) {
    // splitText(0)会使原dom销毁造成startContainer向上逃逸
    let temp
    if (container.nodeType === 3) {
      if (!offset) {
        container.parentNode.insertBefore(this.dom, container)
      } else {
        temp = container.splitText(offset)
        container.parentNode.insertBefore(this.dom, temp)
      }
    } else {
      if (container.childNodes[offset - 1] && container.childNodes[offset - 1].nodeName === 'BR') {
        container.insertBefore(this.dom, container.childNodes[offset - 1])
      } else if (container.childNodes[offset]) {
        container.insertBefore(this.dom, container.childNodes[offset])
      } else {
        container.appendChild(this.dom)
      }
    }
    return this._getRect(container, offset, temp)
  }
  computeOffset(dom, res = { x: 0, y: 0, h: null }) {
    res.h = res.h ?? dom.offsetHeight
    res.x += dom.offsetLeft
    res.y += dom.offsetTop
    if (dom.offsetParent && dom.offsetParent.tagName !== 'BODY') {
      return this.computeOffset(dom.offsetParent, res)
    }
    return res
  }
  _getRect(container, offset, temp) {
    let con = container
    if (!(container instanceof Element)) {
      con = container.parentNode
    }
    const copyStyle = getComputedStyle(con)
    const h = multiplication(copyStyle.fontSize, 1.3) / 1
    const rect = { ...this.computeOffset(this.dom), h }
    this.dom.remove()
    if (container.nodeType === 3 && offset) {
      if (!container.data && container.nextSibling) {
        container.nextSibling.remove()
      } else {
        container.data += temp.data
        temp.remove()
      }
    }
    return rect
  }
}
