import Vnode from './Vnode'
export default class elementVNode extends Vnode {
  static createElement (tagName, ops) { }
  constructor(tagName, ops, parent, position) {
    this.tagName = tagName
    if (parent) {
      this.position = parent.position + position
      this.path = [...parent.path, this]
      this.parentNode = parent
      this.index = position
    }
  }
  splitNode (index) {
    if (index === 0) {
      return index
    }
    if (index === this.length + 1) {
      return index + 1
    }
    const splited = elementVNode.createElement(this.tagName, { styles: this.styles, classes: this.classes, events: this.events })
    this.childrens.slice(index).forEach((ele) => ele.moveTo(splited))
    this.parentNode.insert(splited, index + 1)
    return splited
  }
}
