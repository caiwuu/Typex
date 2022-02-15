import Vnode from './Vnode'
export class textVNode extends Vnode {
  tagName = 'text'
  constructor(context) {
    this.context = context
  }
  delete (offset, count) {
    const start = offset - count <= 0 ? 0 : offset - count
    const context = this.context.slice(0, start) + this.context.slice(offset)
    this.setContext(context)
  }
  setContext (context) {
    this.context = context
    this.ele.data = target.context
  }
  splitNode (index) {
    console.log('splitNode')
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
    this.parentNode.insert(splited, index + 1)
    return splited
  }
  get length () {
    console.log('length')
    return this.context.length
  }
  get isEmpty () {
    console.log('isEmpty')
    return this.length === 0
  }
}
