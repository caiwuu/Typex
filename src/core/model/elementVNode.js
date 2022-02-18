import VNode from './vnode'
import { type, typeValidate } from '../share/utils'
export default class elementVNode extends VNode {
  type = 'elementNode'
  constructor(tagName, attrs = {}, children = []) {
    if (tagName._isVnode) return tagName
    if (type(attrs) !== 'object') {
      children = [attrs]
      attrs = {}
    } else {
      children = [children]
    }
    typeValidate(tagName, ['string', 'function'], "argument 'tagName' expect 'string'|'function'|'vnode'")
    super()
    this.tagName = tagName
    // set style
    const style = attrs.style || ''
    const styles = new Map()
    if (typeof style === 'string') {
      style
        .split(';')
        .map((s) => s.split(':'))
        .forEach((v) => {
          if (!v[0] || !v[1]) {
            return
          }
          styles.set(v[0].trim(), v[1].trim())
        })
    } else if (typeof style === 'object') {
      Object.keys(style).forEach((key) => {
        styles.set(key, style[key])
      })
    }
    Reflect.deleteProperty(attrs, 'style')
    this.styles = styles

    // set classes
    const className = (attrs.class || '').trim()
    this.classes = new Set(className ? className.split(/\s+/g) : [])
    Reflect.deleteProperty(attrs, 'class')

    // set listeners
    this.listeners = new Map()
    Object.keys(attrs).forEach((key) => {
      if (/^on[A-Z]/.test(key)) {
        this.listeners.set(key.replace(/^on/, '').toLowerCase(), attrs[key])
      } else {
        this.attrs[key] = attrs[key]
      }
    })
    children && children.flat().length && this.appendChild(...children.flat())
  }
  splitNode(index) {
    if (index === 0) {
      return index
    }
    if (index === this.length + 1) {
      return index + 1
    }
    const splited = elementVNode.createElement(this.tagName, { styles: this.styles, classes: this.classes, events: this.events })
    this.children.slice(index).forEach((ele) => ele.moveTo(splited))
    this.parentNode.insert(splited, index + 1)
    return splited
  }
}
