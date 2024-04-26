/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 13:58:43
 */
import coreContext from '../coreContext'
import { execHook } from './utils'
export const nativeDocument = document
export const nativeWindow = window
export const nativeSelection = document.getSelection()
export const mountQueue = []
export function insertBefore (parentNode, newNode, referenceNode) {
  enqueueMount()
  return parentNode.insertBefore(newNode, referenceNode)
}
export function replaceChild (parentNode, newNode, oldNode) {
  enqueueMount()
  execDestory(oldNode)
  return parentNode.replaceChild(newNode, oldNode)
}
export function appendChild (parentNode, newNode) {
  enqueueMount()
  return parentNode.appendChild(newNode)
}
export function removeChild (parentNode, referenceNode) {
  execDestory(referenceNode)
  console.log(1);
  return parentNode.removeChild(referenceNode)
}

export function domToVNode (node) {
  const type = node.tagName.toLowerCase() || 'text'
  if (type === 'text') {
    return coreContext.core.createVnode(type)
  }
  const config = {}
  const children = []
  const elmAttrs = node.attributes
  const elmChildren = node.childNodes
  for (let i = 0, n = elmAttrs.length; i < n; i++) {
    let name = elmAttrs[i].nodeName
    if (name === 'style' && isPrimitive(elmAttrs[i].nodeValue)) {
      config[name] = styleToObj(elmAttrs[i].nodeValue)
    } else {
      config[name] = elmAttrs[i].nodeValue
    }
  }
  for (let i = 0, n = elmChildren.length; i < n; i++) {
    children.push(domToVNode(elmChildren[i]))
  }
  return coreContext.core.createVnode(type, config, children)
}

function enqueueMount () {
  let ins
  while (ins = mountQueue.pop()) {
    execHook(ins, 'onMounted')
  }
}

function execDestory (oldElm) {
  const oldVdom = coreContext.core.getVdomOrElm(oldElm)
  const ins = coreContext.core.getVdomOrIns(oldVdom)
  if (ins) {
    execHook(ins, 'onDestoryed')
  }
  traverseAndDestroy(oldVdom)
}
function traverseAndDestroy (oldVdom) {
  switch (oldVdom.vnodeType) {
    case coreContext.core.vnodeType.VTEXT:
    case coreContext.core.vnodeType.VFUNCTION:
      break;

    case coreContext.core.vnodeType.VCOMPONENT:
      const ins = coreContext.core.getVnodeOrIns(oldVdom)
      if (!ins) return
      const vdom = coreContext.core.getVdomOrIns(ins)
      if (!vdom) return
      traverseAndDestroy(vdom)
      execHook(ins, 'onDestoryed')
      break

    case coreContext.core.vnodeType.VDOM:
      oldVdom.children?.forEach(ch => {
        traverseAndDestroy(ch)
      })
      break;
  }
  // console.log(11);
  // if (oldVnode.vnodeType === coreContext.core.vnodeType.VTEXT) return

  // if (oldVnode.children?.length) {
  //   oldVnode.children.forEach(ch => {
  //     traverseAndDestroy(ch)
  //   })
  // }
  // if (oldVnode.vnodeType === coreContext.core.vnodeType.VCOMPONENT) {
  //   const ins = coreContext.core.getVnodeOrIns(oldVnode)
  //   if (!ins) return
  //   const vdom = coreContext.core.getVdomOrIns(ins)
  //   if (!vdom) return
  //   traverseAndDestroy(vdom)
  //   execHook(ins, 'onDestoryed')
  // }
}
