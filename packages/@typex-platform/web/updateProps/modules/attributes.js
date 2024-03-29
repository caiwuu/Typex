const xlinkNS = 'http://www.w3.org/1999/xlink'
const xmlNS = 'http://www.w3.org/XML/1998/namespace'
const colonChar = 58
const xChar = 120
function updateAttrs(elm, vnode, oldVnode) {
  let key
  let oldAttrs = oldVnode?.props
  let attrs = vnode.props

  if (!oldAttrs && !attrs) return
  if (oldAttrs === attrs) return
  oldAttrs = oldAttrs || {}
  attrs = attrs || {}
  // update modified attributes, add new attributes
  for (key in attrs) {
    if (/^on[A-Z]|class|style/.test(key)) {
      continue
    }
    const cur = attrs[key]
    const old = oldAttrs[key]
    if (old !== cur) {
      if (cur === true) {
        elm.setAttribute(key, '')
      } else if (cur === false) {
        elm.removeAttribute(key)
      } else {
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur)
        } else if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur)
        } else if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur)
        } else {
          elm.setAttribute(key, cur)
        }
      }
    }
  }
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key)
    }
  }
}

export const attributesModule = {
  create: updateAttrs,
  update: updateAttrs,
}
