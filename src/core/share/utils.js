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
/**
 * 获取最近的共同父级节点
 */
export const getCommonAncestorNode = (from, to) => {
  for (let index = 0; index < to.path.length; index++) {
    if (to.path[index] !== from.path[index]) {
      return to.path[index - 1]
    }
  }
}
// 通过position获取vnode
export const getNode = (baseNode, position) => {
  const recursionTree = {
    childrens: [baseNode],
  }
  return position.split('-').reduce((pre, cur) => {
    return pre.childrens[cur]
  }, recursionTree)
}
// 空节点递归删除 最多删除到块级
export const deleteNode = (vnode) => {
  const parent = vnode.parentNode || vnode
  // 如果父级只有一个子集，则递归删除父级
  if (isEmptyNode(parent)) {
    if (parent.isRoot || (vnode.type === 'block' && vnode.children.length > 1)) {
      console.log(`${vnode.position} is deleted`)
      vnode.remove()
    } else {
      deleteNode(parent)
    }
  } else {
    vnode.remove()
  }
}
// position位置比较 l < r 表示 r节点在 l 之后
// l>r -1,r=l 0,l<r 1
export const comparePosition = (l, r) => {
  const arrL = l.split('-'),
    arrR = r.split('-'),
    minLen = Math.min(arrL.length, arrR.length)
  let flag = 0
  for (let index = 0; index < minLen; index++) {
    if (arrL[index] === arrR[index]) {
      flag = 0
    } else {
      flag = arrL[index] < arrR[index] ? 1 : -1
      break
    }
  }
  return flag
}
