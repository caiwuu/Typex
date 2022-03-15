const emptyMap = new Map()
function updateListeners(vnode, oldVnode) {
  const elm = vnode.elm
  let oldListeners = oldVnode?.listeners
  let listeners = vnode?.listeners

  if (!oldListeners && !listeners) return
  if (oldListeners === listeners) return
  oldListeners = oldListeners || emptyMap
  listeners = listeners || emptyMap

  listeners.forEach((value, key) => {
    const cur = value
    const old = oldListeners.get(key)
    if (old !== cur) {
      elm.addEventListener(key, cur, false)
    }
  })
  oldListeners.forEach((value, key) => {
    if (!listeners.has(key)) {
      elm.removeEventListener(key, value, false)
    }
  })
}

export const listenersModule = {
  create: updateListeners,
  update: updateListeners,
}
