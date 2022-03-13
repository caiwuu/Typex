import { isEmptyNode } from '../share/utils'
const insKey = Symbol('key')
const typeKey = Symbol('type')
export default class VNode {
  static [insKey] = 0;
  [typeKey] = null
  key = 0
  ns = ''
  attrs = {}
  position = '0'
  path = []
  index = 0
  parentNode = null
  _isVnode = true
  ele = null
  isRoot = true
  tagName = null
  children = []
  styles = new Map()
  classes = new Set()
  listeners = new Map()
  constructor() {
    this.key = VNode[insKey]
    VNode[insKey]++
    this.path = [this]
  }
  get type () {
    if (this[typeKey]) return this[typeKey]
    switch (this.tagName) {
      case 'div':
      case 'p':
      case 'ul':
      case 'li':
      case 'ol':
        return 'block'
      case 'span':
      case 'a':
      case 'sub':
      case 'sup':
      case 'code':
      case 'string':
      case 'u':
      case 'del':
      case 'em':
        return 'inline'
      case 'text':
        return 'text'
      case 'br':
        return 'br'
      case 'img':
        return 'img'
      default:
        return 'inline'
    }
  }
  getContentMark (inherit = {}, idx = 0) {
    const marker = idx === 0 ? {} : mark(this, inherit)
    idx++
    if (this.children.length) {
      return this.children.map((i) => i.getContentMark(marker, idx)).flat()
    } else {
      return { content: this, mark: marker }
    }
  }
  insert (vnode, index) {
    !vnode.ele && vnode.render()
    index = index === undefined ? this.length : index
    if (this.children.length > index) {
      if (index === 0) {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[0])
      } else {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[index - 1].nextSibling)
      }
    } else {
      this.ele.appendChild(vnode.ele)
    }
    this.children.splice(index, 0, vnode)
    this.reArrangement()
  }
  repalce () {
    console.log('replace')
  }
  delete (index, count) {
    console.log('delete')
    const start = index - count <= 0 ? 0 : index - count
    this.children.splice(start, index - start).forEach((vnode) => vnode.ele.remove())
    this.reArrangement()
  }
  moveTo (target, index) {
    console.log('moveTo')
    const removeNodes = this.parentNode.children.splice(this.index, 1)
    this.parentNode.reArrangement()
    removeNodes.forEach((vnode) => {
      target.insert(vnode, index)
    })
  }
  remove () {
    console.log('remove')
    this.parentNode.children.splice(this.index, 1).forEach((i) => {
      i.removed = true
      i.ele.remove()
    })
    this.parentNode.reArrangement()
  }
  reArrangement () {
    if (this.children) {
      this.children.forEach((item, index) => {
        const oldPosition = item.position
        item.isRoot = false
        item.path = [...this.path, item]
        item.index = index
        this.ns && (item.ns = this.ns)
        item.parentNode = this
        item.position = this.position + '-' + index
        if (oldPosition !== item.position) item.reArrangement()
      })
    }
  }
  appendChild (...vnodes) {
    vnodes && this.children.push(...vnodes)
    this.reArrangement()
  }
  get isEmpty () {
    return isEmptyNode(this)
  }
  get length () {
    return this.children.filter((ele) => ele.type !== 'placeholder').length
  }
  get isEditable () {
    return this.editable !== 'off'
  }
  render () {
    const dom = this.ns ? document.createElementNS(this.ns, this.tagName) : document.createElement(this.tagName)
    this.ele = dom
    dom.vnode = this
    if (this.attrs.isRoot) {
      this.isRoot = this.attrs.isRoot
      Reflect.deleteProperty(this.attrs, 'isRoot')
    }
    if (this.attrs.type) {
      this[typeKey] = this.attrs.type
      Reflect.deleteProperty(this.attrs, 'type')
    }
    if (!this.isEditable) {
      dom.classList.add('editor-disabled')
    }
    // set style
    this.styles.forEach((value, key) => {
      dom.style[key] = value
    })
    // set class
    this.classes.forEach((className) => {
      dom.classList.add(className)
    })
    // set listeners
    this.listeners.forEach((value, key) => {
      dom.addEventListener(key, value)
    })
    Object.keys(this.attrs).forEach((k) => {
      this.ns ? dom.setAttributeNS('http://www.w3.org/1999/xlink', k, this.attrs[k]) : dom.setAttribute(k, this.attrs[k])
      Reflect.deleteProperty(this.attrs, k)
    })
    return dom
  }
}
function mark (vnode, inherit = {}) {
  if (!vnode.children.length) return inherit
  return {
    B: vnode.tagName === 'strong' || inherit.B,
    I: vnode.tagName === 'em' || inherit.I,
    U: vnode.tagName === 'u' || inherit.U,
    D: vnode.tagName === 'del' || inherit.D,
    $FC: vnode.styles.get('color') || inherit.$FC,
    $BG: vnode.styles.get('background') || inherit.$BG,
    $FZ: vnode.styles.get('font-size') || vnode.styles.get('fontSize') || inherit.$FZ,
  }
}