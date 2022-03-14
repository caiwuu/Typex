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
    this.ele.data = context
  }
  splitNode(index) {
    if (index === 0) {
      return index
    }
    if (index === this.length + 1) {
      return index + 1
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
    this.ele = dom
    dom.vnode = this
    return dom
  }
}
