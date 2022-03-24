import { stylesModule } from './modules/styles'
import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { isUndef } from '../share/utils'

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
function createKeyToOldIdx(children, beginIdx, endIdx) {
  const map = {}
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key
    if (key !== undefined) {
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
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      // 新头=旧尾
    } else if (sameVnode(newStartVnode, oldEndVnode)) {
      // Vnode moved left
      patchVnode(newStartVnode, oldEndVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (oldKeyToIdx === undefined) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      }
      idxInOld = oldKeyToIdx[newStartVnode.key]
      if (isUndef(idxInOld)) {
        // New element
        parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
      } else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.tagName !== newStartVnode.tagName) {
          parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.elm)
        } else {
          patchVnode(elmToMove, newStartVnode)
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
function patchVnode(vnode, oldVnode) {
  if (oldVnode === vnode) return
  const elm = (vnode.elm = oldVnode.elm)
  elm.vnode = vnode
  const oldCh = oldVnode.children
  const ch = vnode.children
  update(vnode, oldVnode)
  if (oldCh !== ch) updateChildren(elm, ch, oldCh)
}
export function createElm(vnode, isUpdate = false) {
  const dom = vnode.render()
  if (vnode.children) {
    vnode.children.forEach((vn) => {
      const child = createElm(vn, isUpdate)
      dom.appendChild(child)
      !isUpdate && vn.vm && vn.vm.componentDidMount && vn.vm.componentDidMount()
    })
  }

  return dom
}
export function patch(vnode, oldVnode) {
  if (sameVnode(vnode, oldVnode)) {
    patchVnode(vnode, oldVnode)
    oldVnode.replace(vnode, true)
  } else {
    oldVnode.replace(vnode)
  }
  return vnode
}
