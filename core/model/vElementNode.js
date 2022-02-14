import Vnode from './Vnode'
export default class VElementNode extends Vnode {
  static createElement(tagName, ops) {}
  constructor(tagName, ops) {}
  splitNode(index) {
    if (index === 0) {
      return index
    }
    if (index === this.length + 1) {
      return index + 1
    }
    const splited = VElementNode.createElement(this.tagName, { styles: this.styles, classes: this.classes, events: this.events })
    this.childrens.slice(index).forEach((ele) => ele.moveTo(splited))
    this.parentNode.insert(splited, index + 1)
    return splited
  }
}
