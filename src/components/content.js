import { Component, createRef } from '../core/model/index'

export class Content extends Component {
  render(h) {
    const { children } = this.props
    children.forEach((vn) => {
      this.travel(vn)
    })
    return h(children)
  }
  travel(vnode) {
    vnode.isContent = true
    if (vnode.children) {
      vnode.children.forEach((vn) => this.travel(vn))
    }
  }
}
