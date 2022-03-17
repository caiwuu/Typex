import { Component, createRef } from '../core/model/index'

// export class Content extends Component {
//   render(h) {
//     const { children } = this.props
//     children.forEach((vn) => {
//       this.travel(vn)
//     })
//     return h(children)
//   }
//   travel(vnode) {
//     vnode.isContent = true
//     if (vnode.children) {
//       vnode.children.forEach((vn) => this.travel(vn))
//     }
//   }
// }
export function Content(h, props) {
  const { children } = props
  children.forEach((vn) => {
    travel(vn)
  })
  return h(children)
}
function travel(vnode) {
  vnode.isContent = true
  if (vnode.children) {
    vnode.children.forEach((vn) => travel(vn))
  }
}
