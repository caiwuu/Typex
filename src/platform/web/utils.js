/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 17:10:16
 */
export function multiplication(str, times) {
  return str.replace(/(\d*).*/, function ($0, $1) {
    return $1 * times
  })
}
export function setStyle(dom, style) {
  for (const key in style) {
    dom.style[key] = style[key]
  }
}
export function styleToObj(str) {
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
