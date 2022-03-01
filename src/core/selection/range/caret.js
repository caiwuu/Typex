import Measure from './measure'
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
  setStyle (style = {}) {
    const mergeStyle = Object.assign({}, defaultStyle, style)
    setStyle(this.dom, mergeStyle)
  }
  remove () {
    this.dom.remove()
  }
  getRect (range) {
    let container, offset
    switch (range._d) {
      case 0:
      case 1:
        container = range.startVNode.ele
        offset = range.startOffset
        break
      case 2:
        container = range.endVNode.ele
        offset = range.endOffset
        break
    }
    return this.measure.measure(container, offset)
  }
  update (range, drawCaret = true) {
    this.rect = this.getRect(range)
    if (!drawCaret) return
    range.editor.ui.body.ele.appendChild(this.dom)
    let container = range.startVNode.ele
    if (!container) return
    if (!(container instanceof Element)) {
      container = container.parentNode
    }
    const copyStyle = getComputedStyle(container)
    const caretStyle = {
      top: this.rect.y + 'px',
      // 光标宽度为2
      left: this.rect.x - 1 + 'px',
      height: this.rect.ch + 'px',
      fontSize: copyStyle.fontSize,
      background: copyStyle.color,
      display: range.collapsed ? 'inline-block' : 'none',
    }
    this.setStyle(caretStyle)
  }
}
