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
  if (vnode.children && vnode.children.length) {
    return vnode.children.every((item) => isEmptyNode(item))
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
  if (vnode.parentNode === ceil) {
    return vnode
  } else if (vnode.type === 'block') {
    return vnode
  } else {
    return getLayer(vnode.parentNode)
  }
}
export const isEmptyBlock = (vnode) => {
  console.log(vnode)
  // debugger
  const block = getLayer(vnode)
  return isEmptyNode(block)
}

export const recoverRangePoint = (points) => {
  points.forEach((point) => {
    if (point.flag === 'end') {
      point.range.setEnd(point.container, point.offset)
    } else {
      point.range.setStart(point.container, point.offset)
    }
  })
}
// 多次函数执行器
export const times = (n, fn, context = undefined, ...args) => {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}
