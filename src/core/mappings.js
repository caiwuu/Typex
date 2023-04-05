/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:07
 */
const vdomElmMap = new WeakMap()
const vdomInsMap = new WeakMap()
const pathVdomMap = new WeakMap()

function getVdomOrPath (key) {
  // 通过vn找path
  if (key.vnodeType) {
    if ([3, 4].includes(key.vnodeType)) {
      return pathVdomMap.get(key)
    }
    if (key.vnodeType === 1) {
      const vdom = getVdomOrIns(key)
      if (vdom) return pathVdomMap.get(vdom)
      return null
    }
    if (key.vnodeType === 2) {
      const vdom = getVdomOrIns(key.type)
      if (vdom) return pathVdomMap.get(vdom)
      return null
    }
    // 通过path找vn
  } else {
    return pathVdomMap.get(key)
  }
}
function getVdomOrIns (key) {
  return vdomInsMap.get(key)
}
function getVdomOrElm (key) {
  if (key.vnodeType === 1) {
    return vdomElmMap.get(getVdomOrIns(key))
  }
  if (key.vnodeType === 2) {
    return vdomElmMap.get(getVdomOrIns(key.type))
  }
  return vdomElmMap.get(key)
}
function setVdomOrElm (vn, elm) {
  vdomElmMap.set(elm, vn).set(vn, elm)
}
function setVdomOrIns (vn, ins) {
  vdomInsMap.set(ins, vn).set(vn, ins)
}
function setVdomOrPath (vn, path) {
  pathVdomMap.set(vn, path).set(path, vn)
}
export { setVdomOrElm, setVdomOrIns, setVdomOrPath, getVdomOrElm, getVdomOrPath, getVdomOrIns }
