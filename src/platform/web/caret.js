import { multiplication } from './utils'
let getRect
if (Range.prototype.getClientRects) {
  getRect = (range) => {
    const nativeRange = document.createRange()
    let rect
    if (range.container.elm.nodeType !== 3) {
      if (range.offset === 0) {
        nativeRange.setStart(range.container.elm, range.offset)
        nativeRange.setEnd(range.container.elm, range.offset + 1)
        rect = nativeRange.getClientRects()[0]
      } else {
        nativeRange.setStart(range.container.elm, range.offset - 1)
        nativeRange.setEnd(range.container.elm, range.offset)
        rect = nativeRange.getClientRects()[0]
        rect.x += rect.width
      }
    } else {
      nativeRange.setStart(range.container.elm, range.offset)
      rect = nativeRange.getClientRects()[0]
    }
    nativeRange.setStart(range.container.elm, range.offset)
    const scroll = computeScroll(range.editor.ui.content)
    const offset = computeOffset(range.editor.ui.content)
    return {
      x: rect.x + scroll.x - offset.x,
      y: rect.y + scroll.y - offset.y,
      height: rect.height,
    }
  }
} else {
  getRect = (range) => {
    const res = new Measure().measure(range.container.elm, range.offset)
    return res
  }
}

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
    this.dom = document.createElement('span')
    this.dom.classList.add('custom-caret')
    this.setStyle(this.dom)
  }
  setStyle (style = {}) {
    const mergeStyle = Object.assign({}, defaultStyle, style)
    setStyle(this.dom, mergeStyle)
  }
  remove () {
    this.dom.remove()
  }
  update (range, drawCaret = true) {
    this.rect = getRect(range)
    if (!drawCaret) return
    range.editor.ui.content.appendChild(this.dom)
    let elm = range.startContainer.elm
    if (!elm) return
    if (!(elm instanceof Element)) {
      elm = elm.parentNode
    }
    const copyStyle = getComputedStyle(elm)
    const caretStyle = {
      top: this.rect.y + 'px',
      left: this.rect.x - 1 + 'px',
      height: this.rect.height + 'px',
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
  measure (container, offset) {
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
  _getRect (container, offset, temp) {
    let con = container
    if (!(container instanceof Element)) {
      con = container.parentNode
    }
    const copyStyle = getComputedStyle(con)
    const h = multiplication(copyStyle.fontSize, 1.3) / 1
    const rect = { x: this.dom.offsetLeft, y: this.dom.offsetTop, height: h || this.dom.offsetHeight }
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
function computeOffset (dom, res = { x: 0, y: 0 }) {
  res.height = res.height ?? dom.offsetHeight
  res.x += dom.offsetLeft
  res.y += dom.offsetTop
  if (dom.offsetParent && dom.offsetParent.tagName !== 'HTML') {
    return computeOffset(dom.offsetParent, res)
  }
  return res

}

function computeScroll (dom, res = { x: 0, y: 0 }) {
  res.x += dom.scrollLeft || 0
  res.y += dom.scrollTop || 0
  if (dom.parentNode) {
    return computeScroll(dom.parentNode, res)
  }
  return res
}
