export const type = (target) => Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
export const typeValidate = (target, requiredTypes, message) => {
  const targetTypes = type(requiredTypes) === 'string' ? requiredTypes.split(',') : requiredTypes
  const targetType = type(target)
  if (!targetTypes.includes(targetType)) throw TypeError(message)
}
export const setStyle = (dom, style) => {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}
export const multiplication = (str, times) => {
  return str.replace(/(\d*).*/, function ($0, $1) {
    return $1 * times
  })
}
export const isEmptyNode = (vnode) => {
  if (vnode.childrens && vnode.childrens.length) {
    return vnode.childrens.every((item) => isEmptyNode(item))
  } else {
    // TODO  暂时无placeholder类型
    if (vnode.type === 'placeholder') {
      return true
    } else if (vnode.type === 'text') {
      return vnode.context === ''
    } else if (['img', 'br'].includes(vnode.type)) {
      return false
    } else {
      return true
    }
  }
}
export const getLayer = (vnode, ceil) => {
  if (vnode.parent === ceil) {
    return vnode
  } else if (vnode.type === 'block') {
    return vnode
  } else {
    return getLayer(vnode.parent)
  }
}
export const isEmptyBlock = (vnode) => {
  // debugger
  const block = getLayer(vnode)
  return isEmptyNode(block)
}
