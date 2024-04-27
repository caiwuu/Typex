import coreContext from '../coreContext'
import updateProps from './updateProps'
import { execHook } from './utils'
import { mountQueue } from './dom'

/**
 * @description 创建dom
 * @export
 * @param {*} vnode
 * @returns {*}  
 */
export default function createElm (vnode) {
  // vnodeType 1 函数组件 2 类组件 3 文本节点 4 dom节点
  const { createVnode, setVdomOrIns, setVnodeOrIns, setVdomOrElm, vnodeType: {
    VFUNCTION,
    VCOMPONENT,
    VTEXT
  } } = coreContext.core
  let elm
  if (vnode.vnodeType === VFUNCTION) {
    const vdom = vnode.tag(createVnode, vnode.props)
    elm = createElm(vdom)
    if (vnode.ref) vnode.ref.current = elm
    setVdomOrIns(vdom, vnode)
    setVdomOrElm(elm, vdom)
    updateProps(vdom)
  } else if (vnode.vnodeType === VCOMPONENT) {
    const ins = new vnode.tag(vnode.props)
    // 给ref赋值
    if (vnode.ref) vnode.ref.current = ins
    // 执行 onCreated 钩子
    setVnodeOrIns(ins, vnode)
    execHook(ins, 'onCreated')
    mountQueue.push(ins)

    // 执行render创建虚拟dom
    const vdom = ins._generateVdom_(createVnode)
    elm = createElm(vdom)

    // 创建 ins vnode vdom elm 关系映射
    setVdomOrIns(vdom, ins)
    setVdomOrElm(elm, vdom)

    // 把vdom上面的属性添加到真实dom
    updateProps(vdom)
  } else if (vnode.vnodeType === VTEXT) {
    elm = document.createTextNode(vnode.children)
    setVdomOrElm(elm, vnode)
    return elm
  } else {
    elm = vnode.ns
      ? document.createElementNS(vnode.ns, vnode.tag)
      : document.createElement(vnode.tag)
    if (vnode.ref) vnode.ref.current = elm
    setVdomOrElm(elm, vnode)
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