import { setVnElm, setVnIns, createVnode, insertedInsQueue } from '@/core'
import updateProps from './updateProps'
export default function createElm(vnode) {
  let elm
  if (vnode.type === 'text') {
    elm = document.createTextNode(vnode.children)
    setVnElm(elm, vnode)
    return elm
  }
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      const ins = new vnode.type(vnode.props)
      const vn = ins.render(createVnode)
      vnode.ins = ins
      ins._$pv = vnode
      setVnIns(ins, vn)
      if (vnode.ref) vnode.ref.current = ins
      elm = createElm(vn)
      insertedInsQueue.push(ins)
      setVnElm(elm, vn)
      updateProps(vn)
    } else {
      const vn = vnode.type(createVnode, vnode.props)
      setVnIns(vnode, vn)
      elm = createElm(vn)
      if (vnode.ref) vnode.ref.current = elm
      setVnElm(elm, vn)
      updateProps(vnode)
    }
  } else {
    if (vnode.ns) {
      console.log(vnode.type)
    }
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    if (vnode.ref) vnode.ref.current = elm
    setVnElm(elm, vnode)
    updateProps(vnode)
  }
  if (vnode.children?.length === 1) {
    elm.appendChild(createElm(vnode.children[0]))
  } else if (vnode.children?.length > 1) {
    const fragment = document.createDocumentFragment()
    for (let index = 0; index < vnode.children.length; index++) {
      const ch = vnode.children[index]
      fragment.appendChild(createElm(ch))
    }
    elm.appendChild(fragment)
  }
  return elm
}
