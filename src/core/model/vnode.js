import { isEmptyNode } from '../share/utils'
import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
const insKey = Symbol('key')
export default class VNode {
  static [insKey] = 0
  _type = null
  key = 0
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
  children = []
  styles = new Map()
  classes = new Set()
  listeners = new Map()
  constructor() {
    this.key = VNode[insKey]
    VNode[insKey]++
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
    !vnode.elm && vnode.render()
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
    console.log('replace')
    !vnode.elm && vnode.render()
    !onlyVnode && this.elm.parentNode.insertBefore(vnode.elm, this.elm)
    !onlyVnode && this.elm.remove()
    this.parentNode.children.splice(this.index, 1, vnode)
    this.reArrangement()
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
  reArrangement() {
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
  render() {
    const dom = this.ns ? document.createElementNS(this.ns, this.tagName) : document.createElement(this.tagName)
    this.elm = dom
    dom.vnode = this
    stylesModule.create(this)
    classesModule.create(this)
    listenersModule.create(this)
    attributesModule.create(this)
    return dom
  }
}
