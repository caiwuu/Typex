import { Component } from '../core/model/index'

export class Diseditable extends Component {
  render(h) {
    const { children } = this.props
    children.forEach((vn) => {
      this.staticTravel(vn)
    })
    return h(children)
  }
  staticTravel(vnode) {
    if (vnode.editable !== 'on') {
      vnode.editable = 'off'
      if (vnode.children) {
        vnode.children.forEach((vn) => this.staticTravel(vn))
      }
    }
  }
}
