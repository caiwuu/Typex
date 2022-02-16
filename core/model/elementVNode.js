import Vnode from './Vnode'
import textVNode from './textVNode'
export default class elementVNode extends Vnode {
  type = 'elementNode'
  static createElement(tagName, attrs, children = []) {
    if (typeof tagName === 'function') {
      return tagName({
        ...attrs,
        children,
      })
    }
    if (typeof attrs === 'string') {
      children = [attrs]
      attrs = {}
    }
    const vnode = new elementVNode(tagName, attrs)
    children.forEach((ch) => {
      if (ch instanceof elementVNode) {
        vnode.appendChild(ch)
      } else if (!!ch) {
        vnode.appendChild(new textVNode(String(ch)))
      }
    })
    return vnode
  }
  constructor(tagName, attrs, children = []) {
    attrs = attrs || {}
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
    this.listeners = {}
    Object.keys(attrs).forEach((key) => {
      if (/^on[A-Z]/.test(key)) {
        this.listeners[key.replace(/^on/, '').toLowerCase()] = attrs[key]
      } else {
        this.attrs[key] = attrs[key]
      }
    })
    this.appendChild(...children)
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
