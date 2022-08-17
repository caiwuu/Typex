/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-09 16:06:14
 */
const VNElmMap = new WeakMap()
const VNInsMap = new WeakMap()
const markVNMap = new WeakMap()

function getVnOrMark (key) {
  // 通过vn找mark
  if (key._isVnode) {
    if (key.type === 'text') {
      return markVNMap.get(key)
    } else {
      const ins = getVnOrIns(key)
      return markVNMap.get(ins._$pv)
    }

    // 通过mark找vn
  } else {
    let vn = markVNMap.get(key)
    if (typeof vn.type === 'function') {
      vn = getVnOrIns(vn.ins)
    }
    return vn
  }
}
function getVnOrIns (key) {
  return VNInsMap.get(key)
}
function getVnOrElm (key) {
  return VNElmMap.get(key)
}
function setVnElm (vn, elm) {
  VNElmMap.set(elm, vn).set(vn, elm)
}
function setVnIns (vn, ins) {
  VNInsMap.set(ins, vn).set(vn, ins)
}
function setVnMark (vn, mark) {
  markVNMap.set(vn, mark).set(mark, vn)
}

window.VNElmMap = VNElmMap
window.VNInsMap = VNInsMap
export {
  setVnElm,
  setVnIns,
  setVnMark,
  getVnOrElm,
  getVnOrMark,
  getVnOrIns,
}
