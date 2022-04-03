import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { isUndef, isDef } from '../share/utils'
import h from './createElement'
let insertedVnodeQueue = []
function update(vnode, oldVnode) {
  if (vnode.tagName === 'text') {
    vnode.elm.data = vnode.context
  } else {
    stylesModule.update(vnode, oldVnode)
    attributesModule.update(vnode, oldVnode)
    listenersModule.update(vnode, oldVnode)
    classesModule.update(vnode, oldVnode)
  }
}
function sameVnode(vnode, oldVnode) {
  return vnode?.key === oldVnode?.key && vnode?.tagName === oldVnode?.tagName
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
      parentElm.insertBefore(createElm(ch), before)
      ch.vm && insertedVnodeQueue.push(ch)
    }
  }
}
function invokeDestroyHook(vnode) {
  const vm = vnode.vm
  if (vm !== undefined) {
    vm?.destroy?.(vnode)
    // for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
    if (vnode.children !== undefined) {
      for (let j = 0; j < vnode.children.length; ++j) {
        const child = vnode.children[j]
        if (child != null && typeof child !== 'string') {
          invokeDestroyHook(child)
        }
      }
    }
  }
}
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (ch != null) {
      invokeDestroyHook(ch)
      parentElm.removeChild(ch.elm)
    }
  }
}
export function updateChildren(parentElm, newCh, oldCh, insertedVnodeQueue) {
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
      patchVnode(newStartVnode, oldStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      // 新尾=旧尾
    } else if (sameVnode(newEndVnode, oldEndVnode)) {
      patchVnode(newEndVnode, oldEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      // 旧头=新尾
    } else if (sameVnode(newEndVnode, oldStartVnode)) {
      // Vnode moved right
      patchVnode(newEndVnode, oldStartVnode, insertedVnodeQueue)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      patchVnode(newStartVnode, oldEndVnode, insertedVnodeQueue)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
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
        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
        newStartVnode.vm && insertedVnodeQueue.push(newStartVnode)
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
          newStartVnode.vm && insertedVnodeQueue.push(newStartVnode)
        } else {
          patchVnode(newStartVnode, elmToMove, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  }
  if (oldStartIdx <= oldEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
function patchVnode(vnode, oldVnode, insertedVnodeQueue) {
  if (oldVnode === vnode) return
  const elm = (vnode.elm = oldVnode.elm)
  elm.vnode = vnode
  const oldCh = oldVnode.children
  const ch = vnode.children
  update(vnode, oldVnode)
  if (oldCh !== ch) updateChildren(elm, ch, oldCh, insertedVnodeQueue)
}
export function createElm(vnode) {
  const dom = vnode.render()
  if (vnode.children) {
    vnode.children.forEach((vn) => {
      const child = createElm(vn)
      dom.appendChild(child)
      isDef(vn.vm) && insertedVnodeQueue.push(vn)
    })
  }
  return dom
}
export function patch(vnode, oldVnode) {
  insertedVnodeQueue = []
  if (isUndef(oldVnode)) {
    return createElm(vnode)
  }
  let isInit = false
  const isRealElment = isDef(oldVnode.nodeType)
  if (isRealElment) {
    isInit = true
    const elm = oldVnode
    oldVnode = h(oldVnode.tagName.toLowerCase())
    oldVnode.elm = elm
  }
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode, insertedVnodeQueue)
    oldVnode.replace(vnode, true)
    isInit && isDef(vnode.vm) && insertedVnodeQueue.push(vnode)
    isInit = false
  } else {
    oldVnode.replace(vnode)
    isDef(vnode.vm) && insertedVnodeQueue.push(vnode)
  }
  return vnode.elm
}
export { insertedVnodeQueue }
