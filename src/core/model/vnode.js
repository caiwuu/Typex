import { isEmptyNode } from '../share/utils'
import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { createElm } from './patch'
export default class VNode {
  _type = null
  editable = null
  key = null
  ns = ''
  attrs = {}
  position = '0'
  path = []
  index = 0
  parentNode = null
  _isVnode = true
  elm = null
  isRoot = true
  tagName = null
  _children = []
  styles = new Map()
  classes = new Set()
  listeners = new Map()
  constructor() {
    this.path = [this]
  }
  get type() {
    if (this._type) return this._type
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
      case 'strong':
      case 'u':
      case 'del':
      case 'em':
        return 'inline'
      case 'text':
        return 'text'
      case 'br':
      case 'img':
        return 'atomic'
      default:
        return 'inline'
    }
  }
  insert(vnode, index) {
    !vnode.elm && createElm(vnode)
    index = index === undefined ? this.length : index
    if (this.children.length > index) {
      if (index === 0) {
        this.elm.insertBefore(vnode.elm, this.elm.childNodes[0])
      } else {
        this.elm.insertBefore(vnode.elm, this.elm.childNodes[index - 1].nextSibling)
      }
    } else {
      this.elm.appendChild(vnode.elm)
    }
    this.children.splice(index, 0, vnode)
    this.reArrangement()
  }
  replace(vnode, onlyVnode = false) {
    !vnode.elm && createElm(vnode)
    !onlyVnode && this.elm.parentNode.replaceChild(vnode.elm, this.elm)
    this.parentNode?.children.splice(this.index, 1, vnode)
    this.parentNode?.reArrangement()
  }
  delete(index, count) {
    console.log('delete')
    const start = index - count <= 0 ? 0 : index - count
    this.children.splice(start, index - start).forEach((vnode) => vnode.elm.remove())
    this.reArrangement()
  }
  moveTo(target, index) {
    console.log('moveTo')
    const removeNodes = this.parentNode.children.splice(this.index, 1)
    this.parentNode.reArrangement()
    removeNodes.forEach((vnode) => {
      target.insert(vnode, index)
    })
  }
  remove() {
    console.log('remove')
    this.parentNode.children.splice(this.index, 1).forEach((i) => {
      i.removed = true
      i.elm.remove()
    })
    this.parentNode.reArrangement()
  }
  reArrangement(deep = true) {
    if (this.children) {
      this.children.forEach((item, index) => {
        const oldPosition = item.position
        item.isRoot = false
        item.path = [...this.path, item]
        item.index = index
        this.ns && (item.ns = this.ns)
        item.parentNode = this
        item.position = this.position + '-' + index
        if (oldPosition !== item.position && deep) item.reArrangement(deep)
      })
    }
  }
  appendChild(...vnodes) {
    vnodes && this.children.push(...vnodes)
    this.reArrangement()
  }
  get isEmpty() {
    return isEmptyNode(this)
  }
  get length() {
    return this.children.filter((ele) => ele.type !== 'placeholder').length
  }
  get isEditable() {
    return this.editable !== 'off'
  }
  get children() {
    return this._children
  }
  get nextSibling() {
    return this.parentNode?.children[this.index + 1] || null
  }
  set children(chs) {
    console.log('set children')
    this._children = chs
    this.reArrangement()
  }
  render() {
    const dom = this.ns
      ? document.createElementNS(this.ns, this.tagName)
      : document.createElement(this.tagName)
    this.elm = dom
    dom.vnode = this
    stylesModule.create(this)
    classesModule.create(this)
    listenersModule.create(this)
    attributesModule.create(this)
    return dom
  }
  toJson(deep = false) {
    const attrs = { ...this.attrs }
    if (this.isRoot) attrs.isRoot = true
    if (this._type) attrs.type = this._type
    if (this.editable) attrs.editable = this.editable
    if (this.key !== null) attrs.key = this.key
    if (this.ns) attrs.ns = this.ns
    if (this.classes.size) attrs.class = [...this.classes].join(' ')
    if (this.styles.size) {
      attrs.style = [...this.styles].reduce((pre, curr) => {
        return `${pre}${curr[0]}:${curr[1]};`
      }, '')
    }
    this.listeners.forEach((value, key) => {
      attrs[key] = value
    })
    return {
      tagName: this.tagName,
      attrs,
      children: deep ? this.children.map((ch) => ch.toJson(deep)) : [],
    }
  }
}
