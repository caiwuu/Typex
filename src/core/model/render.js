import createElement from './createElement'
import { patch, insertedVnodeQueue } from './patch'
import { toRawType } from '../share/utils'
export const mount = (vnode, root) => {
  if (toRawType(vnode) === 'array') {
    root.appendChild(patch(vnode))
    vnode.vm && insertedVnodeQueue.push(vnode)
  } else {
    patch(vnode, root)
  }
  // 执行mounte钩子
  for (let i = 0; i < insertedVnodeQueue.length; i++) {
    const vn = insertedVnodeQueue[i]
    vn?.vm?.onMounted?.()
  }
}
export const update = (vm) => {
  const oldVnode = vm.vnode
  const newVnode = vm._render_(createElement)
  vm.vnode = newVnode
  patch(newVnode, oldVnode)
}
