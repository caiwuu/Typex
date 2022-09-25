/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-01 11:10:05
 */
import { default as h, insertedInsQueue } from './createVnode'
import {
  insertBefore,
  replaceChild,
  removeChild,
  domToVNode,
  updateProps,
  createElm,
} from '@/platform'
import { getVnOrElm, getVnOrIns, setVnElm, setVnIns } from '../../mappings'
import { isUndef, isDef } from '../../utils'
function sameVnode(vnode, oldVnode) {
  return vnode?.key === oldVnode?.key && vnode?.type === oldVnode?.type
}
function findIdxInOld(node, oldCh, start, end) {
  for (let i = start; i < end; i++) {
    const c = oldCh[i]
    if (isDef(c) && sameVnode(node, c)) return i
  }
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (isDef(key)) {
      map[key] = i
    }
  }
  return map
}

function addVnodes(parentElm, before = null, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      const elm = createElm(ch)
      // TODO
      setVnElm(elm, ch)
      insertBefore(parentElm, elm, before)
    }
  }
}
function invokeDestroyHook(vnode, destoryQueue) {
  const vn = vnode.ins ? getVnOrIns(vnode.ins) : vnode
  if (vn !== undefined) {
    const ins = getVnOrIns(vn)
    ins?.onBeforeUnmount?.()
    if (vn.children !== undefined) {
      for (let j = 0; j < vn.children.length; ++j) {
        const child = vn.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child, destoryQueue)
        }
      }
    }
    // 销毁映射
    if (ins) {
      destoryQueue.push(ins)
    }
  }
}
function removeVnodes(parentElm, oldCh, startIdx, endIdx) {
  console.log(oldCh, startIdx, endIdx)
  for (; startIdx <= endIdx; ++startIdx) {
    const vnode = oldCh[startIdx]
    if (vnode != null) {
      let destoryQueue = []
      // const dom = getVnOrElm(vnode)
      let dom = getVnOrElm(vnode)
      if (!dom) dom = getVnOrElm(getVnOrIns(vnode.ins || {}))
      console.log(dom, vnode)
      debugger
      dom && removeChild(parentElm, dom)
      invokeDestroyHook(vnode, destoryQueue)
      destoryQueue.forEach((ins) => {
        ins.onUnmounted?.()
      })
      destoryQueue = null
    }
  }
}
function updateChildren(parentElm, newCh, oldCh) {
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
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode might have been moved left
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newCh[++newStartIdx]
    } else if (newEndVnode == null) {
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
      insertBefore(parentElm, getVnOrElm(oldStartVnode), getVnOrElm(oldEndVnode).nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      patchVnode(newStartVnode, oldEndVnode)
      insertBefore(parentElm, getVnOrElm(oldEndVnode), getVnOrElm(oldStartVnode))
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
        insertBefore(parentElm, createElm(newStartVnode), getVnOrElm(oldStartVnode))
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          insertBefore(parentElm, createElm(newStartVnode), getVnOrElm(oldStartVnode))
        } else {
          patchVnode(newStartVnode, elmToMove)
          oldCh[idxInOld] = undefined
          insertBefore(parentElm, getVnOrElm(elmToMove), getVnOrElm(oldStartVnode))
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : getVnOrElm(newCh[newEndIdx + 1])
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  }
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
function patchVnode(vnode, oldVnode) {
  if (oldVnode === vnode) return
  if (typeof vnode.type === 'function') {
    if (vnode.type.isComponent) {
      // debugger
      // 常规组件
      // const ins = (vnode.ins = oldVnode.ins)
      // ins._$pv = vnode
      // const oldVn = getVnOrIns(ins)
      // ins.props = vnode.props
      // console.log(oldVnode)
      // const newVn = ins.render(h)
      // patchVnode(newVn, oldVn)

      const ins = new vnode.type(vnode.props)
      const newVn = ins.render(h)
      const oldVn = getVnOrIns(oldVnode.ins)
      const elm = getVnOrElm(oldVn)
      vnode.ins = ins
      ins._$pv = vnode
      setVnIns(ins, newVn)
      setVnElm(newVn, elm)
      console.log(vnode, ins, oldVn)
      patchVnode(newVn, oldVn)
    } else {
      // 函数组件
      const oldVn = getVnOrIns(oldVnode)
      const newVn = vnode.type(h, vnode.props)
      setVnIns(vnode, newVn)
      patchVnode(newVn, oldVn)
    }
  } else if (vnode.type === 'text') {
    const elm = getVnOrElm(oldVnode)
    setVnElm(elm, vnode)
    updateProps(vnode, oldVnode)
  } else {
    // 重新映射elm和vn
    const elm = getVnOrElm(oldVnode)
    setVnElm(elm, vnode)
    // 如果有ins则重新映射ins
    const ins = getVnOrIns(oldVnode)
    ins && setVnIns(vnode, ins)
    const oldCh = oldVnode.children
    const ch = vnode.children
    updateProps(vnode, oldVnode)
    if (oldCh !== ch) updateChildren(elm, ch, oldCh)
  }
}
export default function patch(vnode, oldVnode) {
  // debugger
  insertedInsQueue.length = 0
  // 没有oldvnode 直接创建新dom
  if (isUndef(oldVnode)) {
    const elm = createElm(vnode)
    setVnElm(elm, vnode)
    return elm
  }
  const isRealElment = isDef(oldVnode.nodeType)
  // oldvnode 是dom，先转化为虚拟节点
  if (isRealElment) {
    const elm = oldVnode
    oldVnode = domToVNode(oldVnode)
    setVnElm(elm, oldVnode)
  }
  // 相同节点则执行更新逻辑
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
  } else {
    let oldElm = getVnOrElm(oldVnode)
    const newElm = createElm(vnode)
    replaceChild(oldElm.parentNode, newElm, oldElm)
    oldElm = null
  }
  insertedInsQueue.forEach((ele) => {
    if (ele.onMounted) ele.onMounted()
  })
  insertedInsQueue.length = 0
  return getVnOrElm(vnode)
}
