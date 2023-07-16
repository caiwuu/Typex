import coreContext from '../coreContext'
import updateProps from './updateProps'
export default function createElm(vnode) {
  // vnodeType 1 函数组件 2 类组件 3 文本节点 4 dom节点
  let elm
  if (vnode.vnodeType === 1) {
    const vdom = vnode.type(coreContext.core.createVnode, vnode.props)
    elm = createElm(vdom)
    if (vnode.ref) vnode.ref.current = elm
    coreContext.core.setVdomOrIns(vdom, vnode)
    coreContext.core.setVdomOrElm(elm, vdom)
    updateProps(vdom)
  } else if (vnode.vnodeType === 2) {
    const ins = new vnode.type(vnode.props)
    const vdom = ins.generateVdom(coreContext.core.createVnode)
    elm = createElm(vdom)

    // 执行 onCreated 钩子
    if (typeof ins.onCreated === 'function') ins.onCreated()
    // 给ref赋值
    if (vnode.ref) vnode.ref.current = ins

    coreContext.core.setVdomOrIns(vdom, ins)
    coreContext.core.setVnodeOrIns(ins, vnode)
    coreContext.core.setVdomOrElm(elm, vdom)
    updateProps(vdom)
  } else if (vnode.vnodeType === 3) {
    elm = document.createTextNode(vnode.children)
    coreContext.core.setVdomOrElm(elm, vnode)
    return elm
  } else {
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.type)
      : document.createElement(vnode.type)
    if (vnode.ref) vnode.ref.current = elm
    coreContext.core.setVdomOrElm(elm, vnode)
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

// if (element.vnodeType === 2) {
//   element.type = new type(props)
//   // 执行 onCreated 钩子
//   if (typeof element.type.onCreated === 'function') element.type.onCreated()
//   // 给ref赋值
//   if (element.ref) element.ref.current = element.type
//   element.type.$vnode = element
//   console.log(element);
// }
