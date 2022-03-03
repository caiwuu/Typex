import VNode from './vnode'
export default class elementVNode extends VNode {
  constructor(tagName, attrs = {}, children = []) {
    super()
    this.tagName = tagName
    if (['svg', 'use'].includes(tagName)) {
      this.ns = "http://www.w3.org/2000/svg"
    }
    // set style
    const style = attrs.style || ''
    if (typeof style === 'string') {
      style
        .split(';')
        .map((s) => s.split(':'))
        .forEach((v) => {
          if (!v[0] || !v[1]) {
            return
          }
          this.styles.set(v[0].trim(), v[1].trim())
        })
    } else if (typeof style === 'object') {
      Object.keys(style).forEach((key) => {
        this.styles.set(key, style[key])
      })
    }
    Reflect.deleteProperty(attrs, 'style')

    // set classes
    const className = (attrs.class || '').trim()
    this.classes = new Set(className ? className.split(/\s+/g) : [])
    Reflect.deleteProperty(attrs, 'class')

    // set listeners
    Object.keys(attrs).forEach((key) => {
      if (/^on[A-Z]/.test(key)) {
        this.listeners.set(key.replace(/^on/, '').toLowerCase(), attrs[key])
      } else {
        this.attrs[key] = attrs[key]
      }
    })
    children && children.flat().length && this.appendChild(...children.flat())
  }
  splitNode (index) {
    if (index === 0) {
      return index
    }
    if (index === this.length + 1) {
      return index + 1
    }
    const splited = elementVNode.createElement(this.tagName, { styles: this.styles, classes: this.classes, ...this.listeners })
    this.children.slice(index).forEach((ele) => ele.moveTo(splited))
    this.parentNode.insert(splited, index + 1)
    return splited
  }
}
