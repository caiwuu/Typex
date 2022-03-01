import { Component } from '../core/model/index'

export class Diseditable extends Component {
  render(h) {
    const { children } = this.props
    children.forEach((vn) => {
      this.travel(vn)
    })
    return h(children)
  }
  travel(vnode) {
    if (vnode.editable !== 'on') {
      vnode.editable = 'off'
      if (vnode.children) {
        vnode.children.forEach((vn) => this.travel(vn))
      }
    }
  }
}
