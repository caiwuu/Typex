/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 15:07:04
 */
export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

export function computeLen (path) {
  if (isPrimitive(path.node.data)) {
    return path.node.data.length
  } else if (path.children.length) {
    return path.children.reduce((prevSibling, ele) => {
      return prevSibling + computeLen(ele)
    }, 0)
  } else {
    return 0
  }
}

export function throttle (fn, wait) {
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

export function debounce (fn, ms = 0) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

const _toString = Object.prototype.toString

export function toRawType (value) {
  return _toString.call(value).slice(8, -1).toLowerCase()
}

export function setStyle (dom, style) {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}

export function multiplication (str, times) {
  return str.replace(/(\d*).*/, function ($0, $1) {
    return $1 * times
  })
}

export function stringify (obj) {
  let cache = []
  let res = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // 移除
        return 'Circular reference'
      }
      // 收集所有的值
      cache.push(value)
    }
    return value
  })
  cache = null // 清空变量，便于垃圾回收机制回收
  return res
}

export function styleToObj (str) {
  str = str.trim()
  return str
    .split(';')
    .filter((ele) => ele)
    .reduce((prev, ele) => {
      const kv = ele.split(':')
      prev[kv[0].trim()] = kv[1].trim()
      return prev
    }, {})
}

export function uuid () {
  return ([1e3] + -1e3 + -4e3 + -8e3).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

export function mergeObj (a, b) {
  for (let propName in b) {
    if (b.hasOwnProperty(propName)) {
      if (isUndef(a[propName]) && !isUndef(b[propName])) {
        a[propName] = b[propName]
      }
    }
  }
}
// n次执行
export function times (n, fn, context = undefined, ...args) {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}

/**
 *
 * @export
 * @param {*} a
 * @param {*} b
 * @return {*} 0 a===b;-1 a<b; 1 a>b
 */
export function positionCompare (a, b) {
  if (a === b) return 0
  if (a.originOf(b)) return -1
  if (b.originOf(a)) return 1
  const arrA = a.position.split('-')
  const arrB = b.position.split('-')
  const minLen = Math.min(arrA.length, arrB.length)
  for (let i = 0; i < minLen; i++) {
    const elementA = +arrA[i]
    const elementB = +arrB[i]
    if (elementA > elementB) return 1
    if (elementA < elementB) return -1
  }
}
