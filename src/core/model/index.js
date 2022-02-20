import elementVNode from './elementVNode'
import Component from './component'
import textVNode from './textVNode'
import VNode from './vnode'
import { type, typeValidate } from '../share/utils'
function createElement(tagName, attrs = {}, children = []) {
  if (tagName instanceof VNode) return tagName
  if (type(tagName) === 'array') return tagName.map((ele) => createElement(ele))
  if (type(attrs) !== 'object') {
    children = [attrs]
    attrs = {}
  } else {
    children = [children].flat()
  }
  typeValidate(tagName, ['string', 'function'], "argument 'tagName' expect 'string'|'function'|'vnode'")
  if (typeof tagName === 'function') {
    if (tagName.isConstructor) {
      const vm = new tagName({
        ...attrs,
        children: children.flat(),
      })
      const vn = vm.render(createElement)
      console.log(vn)
      return vn
    } else {
      return tagName({
        ...attrs,
        children: children.flat(),
      })
    }
  }
  if (tagName === 'text') {
    return new textVNode(String(children[0] ?? ''))
  } else {
    const vnode = new elementVNode(tagName, attrs)
    children.flat().forEach((ch) => {
      if (ch instanceof VNode) {
        vnode.appendChild(ch)
      } else if (!!String(ch)) {
        vnode.appendChild(new textVNode(String(ch)))
      }
    })
    return vnode
  }
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
