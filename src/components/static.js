import { Component } from '../core/model/index'

export class Static extends Component {
  render(h) {
    const { children } = this.props
    children.forEach((vn) => {
      this.staticTravel(vn)
    })
    return h(...children)
  }
  staticTravel(vnode) {
    vnode.static = true
    if (vnode.children) {
      vnode.children.forEach((vn) => this.staticTravel(vn))
    }
  }
}
