function updateListeners(elm,vnode, oldVnode) {
  let oldListeners= new Map(),listeners= new Map()
  vnode&&Object.keys(vnode.props).forEach((key) => {
    if (/^on[A-Z]/.test(key)) {
      listeners.set(key.replace(/^on/, '').toLowerCase(), vnode.props[key])
    } 
  })
  oldVnode&&Object.keys(oldVnode.props).forEach((key) => {
    if (/^on[A-Z]/.test(key)) {
      oldListeners.set(key.replace(/^on/, '').toLowerCase(), vnode.props[key])
    } 
  })

  if (!oldListeners.size && !listeners.size) return

  listeners.forEach((value, key) => {
    if (!oldListeners.has(key)) {
      elm.addEventListener(key, value, false)
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
