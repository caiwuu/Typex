import elementVNode from './elementVNode'
import Component from './component'
import textVNode from './textVNode'
import { type, typeValidate } from '../share/utils'
function createElement(tagName, attrs = {}, children = []) {
  if (tagName._isVnode) return tagName
  if (type(attrs) !== 'object') {
    children = [attrs]
    attrs = {}
  } else {
    children = [children]
  }
  typeValidate(tagName, ['string', 'function'], "argument 'tagName' expect 'string'|'function'|'vnode'")
  if (typeof tagName === 'function') {
    console.log(tagName.isConstructor)
    return tagName.isConstructor
      ? new tagName(attrs).render(createElement)
      : tagName({
          ...attrs,
          children: children.flat(),
        })
  }
  const vnode = new elementVNode(tagName, attrs)
  debugger
  children.flat().forEach((ch) => {
    if (ch instanceof elementVNode) {
      vnode.appendChild(ch)
    } else if (!!ch) {
      vnode.appendChild(new textVNode(String(ch)))
    }
  })
  return vnode
}
function render(vnode, root) {
  const dom = [vnode].flat().map((i) => renderDom(i))
  dom.forEach((e) => root.appendChild(e))
}
function renderDom(vnode) {
  const dom = vnode.render()
  if (vnode.children) {
    vnode.children.forEach((vn) => {
      const child = renderDom(vn)
      dom.appendChild(child)
    })
  }
  return dom
}
export { render, createElement, Component }
