/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:07
 */
const vdomElmMap = new WeakMap() // 记录虚拟dom和真实dom的映射
const vnodeInsMap = new WeakMap() // 记录组件实例和组件虚拟节点的映射
const vdomInsMap = new WeakMap() // 记录组件实例和虚拟dom的映射
const vdomPathMap = new WeakMap() // 记录虚拟dom和Path的映射
import { vnodeType } from "./constDefine"
const { VFUNCTION, VCOMPONENT, VTEXT } = vnodeType

function getVdomOrIns (key) {
  return vdomInsMap.get(key)
}
function getVdomOrPath (key) {
  // 通过vn找path
  if (key.vnodeType) {
    const res = vdomPathMap.get(key)
    if (res) return res
    // 如果是文本节点 没找到 那说明这个文本是没有被内容管理器管理的内容
    if (key.vnodeType === VTEXT) return null
    // 如果没找到 可能是组件类型的vdom 需要先找到vnode
    const ins = getVdomOrIns(key)
    const componentVnode = getVnodeOrIns(ins)
    if (ins.vnodeType === VFUNCTION) {
      return vdomPathMap.get(ins)
    } else {
      return vdomPathMap.get(componentVnode)
    }
  } else {
    // 通过path找vn
    const vdom = vdomPathMap.get(key)
    if (!vdom) return
    return vdom
  }
}
function getVnodeOrIns (key) {
  return vnodeInsMap.get(key)
}
function getVdomOrElm (key) {
  if (key.vnodeType === VFUNCTION) {
    return vdomElmMap.get(vdomInsMap.get(key))
  }
  if (key.vnodeType === VCOMPONENT) {
    return vdomElmMap.get(vdomInsMap.get(vnodeInsMap.get(key)))
  }
  return vdomElmMap.get(key)
}
function setVdomOrElm (vn, elm) {
  vdomElmMap.set(elm, vn).set(vn, elm)
}
function setVnodeOrIns (vn, ins) {
  vnodeInsMap.set(ins, vn).set(vn, ins)
}
function setVdomOrPath (vn, path) {
  vdomPathMap.set(vn, path).set(path, vn)
}
function setVdomOrIns (vn, ins) {
  return vdomInsMap.set(ins, vn).set(vn, ins)
}
export {
  setVdomOrElm,
  setVnodeOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVnodeOrIns,
  setVdomOrIns,
  getVdomOrIns,
}
window.aa = {
  setVdomOrElm,
  setVnodeOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVnodeOrIns,
}
