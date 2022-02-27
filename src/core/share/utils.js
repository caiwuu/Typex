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