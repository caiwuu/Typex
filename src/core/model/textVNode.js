import VNode from './vnode'
export default class textVNode extends VNode {
  tagName = 'text'
  _context = ''
  constructor(context) {
    super()
    this._context = context
  }
  delete(offset, count) {
    const start = offset - count <= 0 ? 0 : offset - count
    const context = this.context.slice(0, start) + this.context.slice(offset)
    this.setContext(context)
  }
  setContext(context) {
    this._context = context
    this.elm.data = context
  }
  splitNode(index) {
    if (index === 0) {
      return this.index
    }
    if (index === this.length) {
      return this.index + 1
    }
    const splitedText = this.context.slice(index)
    const context = this.context.slice(0, index)
    this.setContext(context)
    const splited = new textVNode(splitedText)
    this.parentNode.insert(splited, this.index + 1)
    return splited
  }
  set context(value) {
    this._context = value
  }
  get context() {
    return this._context
  }
  get length() {
    return this.context.length
  }
  get isEmpty() {
    return this.length === 0
  }
  render() {
    const dom = document.createTextNode(this.context)
    this.elm = dom
    dom.vnode = this
    return dom
  }
  toJson() {
    const attrs = {}
    if (this._type) attrs.type = this._type
    if (this.key !== null) attrs.key = this.key
    return {
      tagName: this.tagName,
      attrs,
      children: this._context,
    }
  }
  clone() {
    const nVnode = new textVNode(this._context)
    nVnode._type = this.type
    nVnode.key = this.key
    nVnode.position = this.position
    nVnode.index = this.index
    nVnode.parentNode = this.parentNode
    return nVnode
  }
}
