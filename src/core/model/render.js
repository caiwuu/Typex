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
  // const newDom = createElm(newVnode, true)
  vm.vnode = newVnode
  // newVnode.vm = vm
  // newVnode.elm = newDom
  // oldDom.parentNode.replaceChild(newDom, oldDom)
  patch(newVnode, oldVnode)
}
