/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:07
 */
const vdomElmMap = new WeakMap()
const vdomInsMap = new WeakMap()
const pathVnodeMap = new WeakMap()

function getVdomOrPath(key) {
  // 通过vn找path
  if (key.vnodeType) {
    const res = pathVnodeMap.get(key)
    if (res) return res
    // 如果是文本节点 没找到 那说明这个文本是没有被内容管理器管理的内容
    if (key.vnodeType === 3) return null
    // 如果没找到 可能是组件类型的vdom 需要先找到vnode
    const ins = getVdomOrIns(key)
    if (ins.$vnode) return pathVnodeMap.get(ins.$vnode)
    // 对于函数组件 vnode就是ins本身
    return pathVnodeMap.get(ins)
    // 通过path找vn
  } else {
    const vnode = pathVnodeMap.get(key)
    if (vnode.vnodeType === 1) return getVdomOrIns(vnode)
    if (vnode.vnodeType === 2) return getVdomOrIns(vnode.type)
    return vnode
  }
}
function getVdomOrIns(key) {
  return vdomInsMap.get(key)
}
function getVdomOrElm(key) {
  if (key.vnodeType === 1) {
    return vdomElmMap.get(getVdomOrIns(key))
  }
  if (key.vnodeType === 2) {
    return vdomElmMap.get(getVdomOrIns(key.type))
  }
  return vdomElmMap.get(key)
}
function setVdomOrElm(vn, elm) {
  vdomElmMap.set(elm, vn).set(vn, elm)
}
function setVdomOrIns(vn, ins) {
  vdomInsMap.set(ins, vn).set(vn, ins)
}
function setVdomOrPath(vn, path) {
  pathVnodeMap.set(vn, path).set(path, vn)
}
export { setVdomOrElm, setVdomOrIns, setVdomOrPath, getVdomOrElm, getVdomOrPath, getVdomOrIns }
