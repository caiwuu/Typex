/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-23 13:57:14
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
export function times(n, fn, context = undefined, ...args) {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}
