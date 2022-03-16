import createElement from './createElement'
import patch from './patch'
export const render = (vnode, root) => {
  ;[vnode].flat().forEach((vn) => {
    root.appendChild(renderDom(vn))
    vn.vm && vn.vm.componentDidMount && vn.vm.componentDidMount()
  })
}
export const renderDom = (vnode, isUpdate = false) => {
  const dom = vnode.render()
  if (vnode.children) {
    vnode.children.forEach((vn) => {
      const child = renderDom(vn, isUpdate)
      dom.appendChild(child)
      !isUpdate && vn.vm && vn.vm.componentDidMount && vn.vm.componentDidMount()
    })
  }
  if (vnode.attrs.ref) {
    vnode.attrs.ref.current = dom
    delete vnode.attrs.ref
  }
  return dom
}
export const update = (vm) => {
  // const oldDom = vm.dom
  // const newVnode = vm.render(createElement)
  // const newDom = renderDom(newVnode, true)
  // vm.vnode = newVnode
  // newVnode.vm = vm
  // newVnode.elm = newDom
  // oldDom.parentNode.replaceChild(newDom, oldDom)
  patch(vm.render(createElement), vm.vnode)
}
