import { createVnode } from '@/core'
export const nativeDocument = document
export const nativeWindow = window
export const nativeSelection = document.getSelection()
export function insertBefore(parentNode, newNode, referenceNode) {
  return parentNode.insertBefore(newNode, referenceNode)
}
export function replaceChild(parentNode, newNode, oldNode) {
  return parentNode.replaceChild(newNode, oldNode)
}
export function appendChild(parentNode, newNode) {
  return parentNode.appendChild(newNode)
}
export function removeChild(parentNode, referenceNode) {
  return parentNode.removeChild(referenceNode)
}

export function domToVNode(node) {
  const type = node.tagName.toLowerCase() || 'text'
  if (type === 'text') {
    return createVnode(type)
  }
  const config = {}
  const children = []
  const elmAttrs = node.attributes
  const elmChildren = node.childNodes
  for (let i = 0, n = elmAttrs.length; i < n; i++) {
    let name = elmAttrs[i].nodeName
    if (name === 'style' && isPrimitive(elmAttrs[i].nodeValue)) {
      config[name] = styleToObj(elmAttrs[i].nodeValue)
    } else {
      config[name] = elmAttrs[i].nodeValue
    }
  }
  for (let i = 0, n = elmChildren.length; i < n; i++) {
    children.push(domToVNode(elmChildren[i]))
  }
  return createVnode(type, config, children)
}
