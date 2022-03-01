import { Component } from '../core/model/index'

export class Editable extends Component {
  render(h) {
    const { children } = this.props
    children.forEach((vn) => {
      this.travel(vn)
    })
    return h(children)
  }
  travel(vnode) {
    if (vnode.editable !== 'off') {
      vnode.editable = 'on'
      if (vnode.children) {
        vnode.children.forEach((vn) => this.travel(vn))
      }
    }
  }
}
