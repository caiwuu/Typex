/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:07
 */
const VNElmMap = new WeakMap()
const VNInsMap = new WeakMap()
const pathVNMap = new WeakMap()

function getVnOrPath(key) {
  // 通过vn找path
  if (key._isVnode) {
    const path = pathVNMap.get(key)
    if (path) return path
    if (key.type === 'text') {
      return pathVNMap.get(key)
    } else {
      const ins = getVnOrIns(key)
      if (ins) return pathVNMap.get(ins._$pv)
      return null
    }

    // 通过path找vn
  } else {
    let vn = pathVNMap.get(key)
    if (typeof vn.type === 'function') {
      vn = getVnOrIns(vn.ins)
    }
    return vn
  }
}
function getVnOrIns(key) {
  return VNInsMap.get(key)
}
function getVnOrElm(key) {
  if (key.ins) {
    return VNElmMap.get(getVnOrIns(key.ins))
  }
  return VNElmMap.get(key)
}
function setVnElm(vn, elm) {
  VNElmMap.set(elm, vn).set(vn, elm)
}
function setVnIns(vn, ins) {
  VNInsMap.set(ins, vn).set(vn, ins)
}
function setVnPath(vn, path) {
  pathVNMap.set(vn, path).set(path, vn)
}

window.VNElmMap = VNElmMap
window.VNInsMap = VNInsMap
export { setVnElm, setVnIns, setVnPath, getVnOrElm, getVnOrPath, getVnOrIns }
