import coreContext from '../coreContext'
import updateProps from './updateProps'
export default function createElm(vnode) {
  let elm
  if (vnode.type === 'text') {
    elm = document.createTextNode(vnode.children)
    coreContext.core.setVnElm(elm, vnode)
    return elm
  }
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      const ins = new vnode.type(vnode.props)
      const vn = ins.render(coreContext.core.createVnode)
      vnode.ins = ins
      ins._$pv = vnode
      coreContext.core.setVnIns(ins, vn)
      if (vnode.ref) vnode.ref.current = ins
      elm = createElm(vn)
      coreContext.core.insertedInsQueue.push(ins)
      coreContext.core.setVnElm(elm, vn)
      updateProps(vn)
    } else {
      const vn = vnode.type(coreContext.core.createVnode, vnode.props)
      coreContext.core.setVnIns(vnode, vn)
      elm = createElm(vn)
      if (vnode.ref) vnode.ref.current = elm
      coreContext.core.setVnElm(elm, vn)
      updateProps(vnode)
    }
  } else {
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    if (vnode.ref) vnode.ref.current = elm
    coreContext.core.setVnElm(elm, vnode)
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
