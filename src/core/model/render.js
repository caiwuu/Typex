import createElement from './createElement'
import { patch, createElm } from './patch'
export const mount = (vnode, root) => {
  ;[vnode].flat().forEach((vn) => {
    root.appendChild(createElm(vn))
    vn.vm && vn.vm.onMounted && vn.vm.onMounted()
  })
}
export const update = (vm) => {
  const oldVnode = vm.vnode
  const newVnode = vm.render(createElement)
  vm.vnode = newVnode
  patch(newVnode, oldVnode)
}
