import createElement from './createElement'
import { patch, createElm } from './patch'
export const render = (vnode, root) => {
  ;[vnode].flat().forEach((vn) => {
    root.appendChild(createElm(vn))
    vn.vm && vn.vm.componentDidMount && vn.vm.componentDidMount()
  })
}
export const update = (vm) => {
  const oldVnode = vm.vnode
  const newVnode = vm.render(createElement)
  vm.vnode = newVnode
  patch(newVnode, oldVnode)
}
