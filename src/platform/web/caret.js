import { multiplication } from './utils'

/** @type {Function} */
let getRect
// 提供两种计算光标坐标的方法，优先使用原生的getClientRects，因为性能较好
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

/**
 * @description 设置光标的样式
 * @param {*} dom
 * @param {*} style
 */
const setStyle = (dom, style) => {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}

/**
 * @description 光标类
 * @export
 * @class Caret
 */
export default class Caret {
  /**
   * @description 光标dom
   * @memberof Caret
   * @instance
   */
  dom = null

  /**
   * @description 光标坐标
   * @memberof Caret
   * @instance
   */
  rect = null

  /**
   * @description 默认样式
   * @memberof Caret
   * @instance
   */
  defaultStyle = {}

  /**
   * @description 当前样式
   * @memberof Caret
   * @instance
   */
  style = {}
  constructor(range) {
    this.range = range
    this.dom = document.createElement('span')
    this.dom.classList.add('custom-caret')
    this.setStyle(this.dom)
  }

  /**
   * @description 设置光标样式
   * @param {*} [style={}]
   * @memberof Caret
   * @instance
   */
  setStyle(style = {}) {
    Object.assign(this.style, this.defaultStyle, style)
  }

  /**
   * @description 光标移除
   * @memberof Caret
   * @instance
   */
  remove() {
    this.dom.remove()
  }

  /**
   * @description 光标隐藏
   * @memberof Caret
   * @instance
   */
  hidden() {
    if (this.style.display === 'none') return
    this.setStyle({ display: 'none' })
    this.draw()
  }

  /**
   * @description 光标显示
   * @memberof Caret
   * @instance
   */
  show() {
    if (this.style.display === 'inline-block') return
    this.setStyle({ display: 'inline-block' })
    this.draw()
  }

  /**
   * @description 光标更新
   * @param {boolean} [drawCaret=true]
   * @memberof Caret
   * @instance
   */
  update(drawCaret = true) {
    this.rect = getRect(this.range)
    if (!drawCaret) return
    this.range.editor.ui.content.appendChild(this.dom)
    let elm = this.range.startContainer.elm
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
      display: this.range.collapsed ? 'inline-block' : 'none',
    }
    this.setStyle(caretStyle)
    this.draw()
  }

  /**
   * @description 绘制光标
   * @memberof Caret
   * @instance
   */
  draw() {
    setStyle(this.dom, this.style)
  }
}

/**
 * @description 光标坐标测量器
 * @class Measure
 */
class Measure {
  /**
   * @description 辅助测量dom
   * @memberof Measure
   */
  dom = null

  /**
   * @description 单例模式 实例
   * @memberof Measure
   */
  instance = null
  constructor() {
    if (!Measure.instance) {
      this.dom = document.createElement('text')
      Measure.instance = this
    } else {
      return Measure.instance
    }
  }

  /**
   * @description 测量方法
   * @param {*} container
   * @param {*} offset
   * @returns {*}
   * @memberof Measure
   */
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

  /**
   * @description 获取坐标
   * @param {*} container
   * @param {*} offset
   * @param {*} temp
   * @private
   * @returns {*}
   * @memberof Measure
   */
  _getRect(container, offset, temp) {
    let con = container
    if (!(container instanceof Element)) {
      con = container.parentNode
    }
    const copyStyle = getComputedStyle(con)
    const h = multiplication(copyStyle.fontSize, 1.3) / 1
    const rect = {
      x: this.dom.offsetLeft,
      y: this.dom.offsetTop,
      height: h || this.dom.offsetHeight,
    }
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

/**
 * @description 累计偏移量计算
 * @param {*} dom
 * @param {*} [res={ x: 0, y: 0 }]
 * @returns {*}
 */
function computeOffset(dom, res = { x: 0, y: 0 }) {
  res.height = res.height ?? dom.offsetHeight
  res.x += dom.offsetLeft
  res.y += dom.offsetTop
  if (dom.offsetParent && dom.offsetParent.tagName !== 'HTML') {
    return computeOffset(dom.offsetParent, res)
  }
  return res
}

/**
 * @description  累计滚动距离计算
 * @param {*} dom
 * @param {*} [res={ x: 0, y: 0 }]
 * @returns {*}
 */
function computeScroll(dom, res = { x: 0, y: 0 }) {
  res.x += dom.scrollLeft || 0
  res.y += dom.scrollTop || 0
  if (dom.parentNode) {
    return computeScroll(dom.parentNode, res)
  }
  return res
}
