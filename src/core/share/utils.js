export function setStyle(dom, style) {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}
export function multiplication(str, times) {
  return str.replace(/(\d*).*/, function ($0, $1) {
    return $1 * times
  })
}
export function isEmptyNode(vnode) {
  if (vnode.children && vnode.children.length) {
    return vnode.children.every((item) => isEmptyNode(item))
  } else {
    if (vnode.type === 'placeholder') {
      return true
    } else if (vnode.editable === 'off') {
      return !vnode.length
    } else if (vnode.type === 'text') {
      return vnode.context === ''
    } else if (vnode.type === 'atomic') {
      return false
    } else {
      return true
    }
  }
}
export function getLayer(vnode, ceil) {
  if (vnode.parentNode === ceil) {
    return vnode
  } else if (vnode.type === 'block') {
    return vnode
  } else {
    return getLayer(vnode.parentNode)
  }
}
export function isEmptyBlock(vnode) {
  const block = getLayer(vnode)
  return isEmptyNode(block)
}

export function recoverRangePoint(points) {
  points.forEach((point) => {
    if (point.flag === 'end') {
      point.range.setEnd(point.container, point.offset)
    } else {
      point.range.setStart(point.container, point.offset)
    }
  })
}
// 多次函数执行器
export function times(n, fn, context = undefined, ...args) {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}
/**
 * 获取最近的共同父级节点
 */
export function getCommonAncestorNode(startVNode, endVNode) {
  if (startVNode === endVNode) return startVNode
  for (let index = 0; index < endVNode.path.length; index++) {
    if (endVNode.path[index] !== startVNode.path[index]) {
      return endVNode.path[index - 1]
    }
  }
}
// 通过position获取vnode
export function getNode(baseNode, position) {
  const recursionTree = {
    childrens: [baseNode],
  }
  return position.split('-').reduce((pre, cur) => {
    return pre.childrens[cur]
  }, recursionTree)
}
// 空节点递归删除 最多删除到块级
export function deleteNode(vnode) {
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
export function comparePosition(l, r) {
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

export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}
/**
 * Check if value is primitive.
 */
export function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType(value) {
  return _toString.call(value).slice(8, -1).toLowerCase()
}

export function typeValidate(target, requiredTypes, message) {
  const targetTypes =
    toRawType(requiredTypes) === 'string' ? requiredTypes.split(',') : requiredTypes
  const targetType = toRawType(target)
  if (!targetTypes.includes(targetType)) throw TypeError(message)
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]'
}

export function throttle(fn, wait) {
  let inThrottle, lastFn, lastTime
  return function () {
    const context = this,
      args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(function () {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args)
          lastTime = Date.now()
        }
      }, Math.max(wait - (Date.now() - lastTime), 0))
    }
  }
}
export function debounce(fn, ms = 0) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function HSLToRGB(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)].map((ele) => round(ele))
}
export function round(n, decimals = 0) {
  return Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)
}

export function RGBToHSL(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ].map((ele) => round(ele))
}
