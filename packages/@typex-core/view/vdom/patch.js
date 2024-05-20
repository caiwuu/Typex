/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:40
 */
import { default as h } from './createVnode'
import pluginContext from '../../pluginContext'
import {
  getVdomOrElm,
  getVnodeOrIns,
  getVdomOrIns,
  setVdomOrElm,
  setVnodeOrIns,
  setVdomOrIns,
} from '../../mappings'
import { isUndef, isDef } from '../../utils'
import { vnodeType } from '../../constDefine'
const { VFUNCTION, VCOMPONENT, VTEXT } = vnodeType

/**
 * @description 判断是否相同节点
 * @param {*} vnode
 * @param {*} oldVnode
 * @returns {*}
 */
function sameVnode (vnode, oldVnode) {
  return vnode?.key === oldVnode?.key && vnode?.tag === oldVnode?.tag
}

/**
 * @description 在老节点中查找id
 * @param {*} node
 * @param {*} oldCh
 * @param {*} start
 * @param {*} end
 * @returns {*}
 */
function findIdxInOld (node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}

/**
 * @description 生成id映射
 * @param {*} children
 * @param {*} beginIdx
 * @param {*} endIdx
 * @returns {*}
 */
function createKeyToOldIdx (children, beginIdx, endIdx) {
  const map = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (isDef(key)) {
      map[key] = i
    }
  }
  return map
}

/**
 * @description 增加节点
 * @param {*} parentElm
 * @param {*} [before=null]
 * @param {*} vnodes
 * @param {*} startIdx
 * @param {*} endIdx
 */
function addVnodes (parentElm, before = null, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      const elm = pluginContext.platform.createElm(ch)
      pluginContext.platform.insertBefore(parentElm, elm, before)
    }
  }
}

/**
 * @description 节点删除
 * @param {*} parentElm
 * @param {*} oldCh
 * @param {*} startIdx
 * @param {*} endIdx
 */
function removeVnodes (parentElm, oldCh, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const vnode = oldCh[startIdx]
    if (vnode != null) {
      let dom = getElmByVnode(vnode)
      dom && pluginContext.platform.removeChild(parentElm, dom)
    }
  }
}

/**
 * @description children更新函数
 * @param {*} parentElm
 * @param {*} newCh
 * @param {*} oldCh
 */
function updateChildren (parentElm, newCh, oldCh) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newEndIdx = newCh.length - 1
  let oldStartVnode = oldCh[0]
  let newStartVnode = newCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode === null) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode === null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode === null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode === null) {
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧头
    } else if (sameVnode(newStartVnode, oldStartVnode)) {
      patchVnode(newStartVnode, oldStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      // 新尾=旧尾
    } else if (sameVnode(newEndVnode, oldEndVnode)) {
      patchVnode(newEndVnode, oldEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      // 旧头=新尾
    } else if (sameVnode(newEndVnode, oldStartVnode)) {
      // Vnode moved right
      patchVnode(newEndVnode, oldStartVnode)
      pluginContext.platform.insertBefore(
        parentElm,
        getElmByVnode(oldStartVnode),
        getElmByVnode(oldEndVnode).nextSibling
      )
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      patchVnode(newStartVnode, oldEndVnode)
      pluginContext.platform.insertBefore(
        parentElm,
        getElmByVnode(oldEndVnode),
        getElmByVnode(oldStartVnode)
      )
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) {
        // New element
        pluginContext.platform.insertBefore(
          parentElm,
          pluginContext.platform.createElm(newStartVnode),
          getElmByVnode(oldStartVnode)
        )
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tag !== newStartVnode.tag) {
          pluginContext.platform.insertBefore(
            parentElm,
            pluginContext.platform.createElm(newStartVnode),
            getElmByVnode(oldStartVnode)
          )
        } else {
          patchVnode(newStartVnode, elmToMove)
          oldCh[idxInOld] = null
          pluginContext.platform.insertBefore(
            parentElm,
            getElmByVnode(elmToMove),
            getElmByVnode(oldStartVnode)
          )
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    before = isUndef(newCh[newEndIdx + 1]) ? null : getVdomOrElm(newCh[newEndIdx + 1])
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  }
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
function getVdomByVnode (vnode) {
  switch (vnode.vnodeType) {
    case VFUNCTION:
      return getVdomOrIns(vnode)
    case VCOMPONENT:
      return getVdomOrIns(getVnodeOrIns(vnode))
    default:
      return vnode
  }
}
function getElmByVnode (vnode) {
  return getVdomOrElm(getVdomByVnode(vnode))
}
/**
 * @description 节点比对
 * @param {*} vnode
 * @param {*} oldVnode
 */
function patchVnode (vnode, oldVnode) {
  if (oldVnode === vnode) return
  if (vnode.vnodeType === VFUNCTION) {
    // 函数组件
    const oldVdom = getVdomByVnode(oldVnode)
    const newVdom = vnode.tag(h, vnode.props)
    return patch(newVdom, oldVdom)
  } else if (vnode.vnodeType === VCOMPONENT) {
    // 常规组件
    const oldVdom = getVdomByVnode(oldVnode)
    const ins = getVnodeOrIns(oldVnode)
    setVnodeOrIns(vnode, ins)
    ins.props = Object.freeze({ ...vnode.props })
    const newVdom = ins._generateVdom_(h)
    setVdomOrIns(ins, newVdom)
    setVnodeOrIns(ins, vnode)
    return patch(newVdom, oldVdom)
  } else if (vnode.vnodeType === VTEXT) {
    const elm = getVdomOrElm(oldVnode)
    setVdomOrElm(elm, vnode)
    pluginContext.platform.updateProps(vnode, oldVnode)
    return elm
  } else {
    // 重新映射elm和vn
    const elm = getVdomOrElm(oldVnode)
    setVdomOrElm(elm, vnode)
    const oldCh = oldVnode.children
    const ch = vnode.children
    pluginContext.platform.updateProps(vnode, oldVnode)
    if (oldCh !== ch) updateChildren(elm, ch, oldCh)
    return elm
  }
}

/**
 * @description diff函数
 * @export
 * @param {*} vnode
 * @param {*} oldVnode
 * @returns {*}
 */
export default function patch (vnode, oldVnode) {
  if (oldVnode === vnode) return
  if (!vnode) {
    const ins = getVnodeOrIns(oldVnode)
    const oldVdom = getVdomOrIns(ins)
    const newVdom = ins._generateVdom_(h)
    setVdomOrIns(ins, newVdom)
    patchVnode(newVdom, oldVdom)
    return getVdomOrElm(newVdom)
  }
  // 没有oldvnode 直接创建新dom
  if (isUndef(oldVnode)) {
    const elm = pluginContext.platform.createElm(vnode)
    return elm
  }
  const isRealElment = isDef(oldVnode.nodeType)
  // oldvnode 是dom，先转化为虚拟节点
  if (isRealElment) {
    const elm = oldVnode
    oldVnode = pluginContext.platform.domToVNode(oldVnode)
    setVdomOrElm(elm, oldVnode)
  }
  // 相同节点则执行更新逻辑
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
  } else {
    let oldElm = getElmByVnode(oldVnode)
    const newElm = pluginContext.platform.createElm(vnode)
    pluginContext.platform.replaceChild(oldElm.parentNode, newElm, oldElm)
  }
  return getElmByVnode(vnode)
}
