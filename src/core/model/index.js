import elementVNode from './elementVNode'
import Component from './component'
import textVNode from './textVNode'
import VNode from './vnode'
import { type, typeValidate } from '../share/utils'
function createElement (tagName, attrs = {}, children = []) {
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
    const mergedAttrs = {
      ...attrs,
      children: children.flat(),
    }
    if (tagName.isConstructor) {
      const ref = mergedAttrs.ref
      ref && delete mergedAttrs.ref
      const vm = new tagName(mergedAttrs)
      ref && (ref.current = vm)
      const vn = vm.render(createElement)
      vm.vnode = vn
      vn.vm = vm
      // beforeMounted
      return vn
    } else {
      return tagName(mergedAttrs)
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
function render (vnode, root) {
  const dom = [vnode].flat().map((i) => renderDom(i))
  dom.forEach((e) => {
    root.appendChild(e.dom)
    e.vm && e.vm.componentDidMount && e.vm.componentDidMount()
  })
}
function renderDom (vnode) {
  // console.log(vnode.vm);
  const dom = vnode.render()
  if (vnode.children) {
    vnode.children.forEach((vn) => {
      const { dom: child, vm } = renderDom(vn)
      dom.appendChild(child)
      vm && vm.componentDidMount && vm.componentDidMount()
    })
  }
  if (vnode.attrs.ref) {
    vnode.attrs.ref.current = dom
    delete vnode.attrs.ref
  }
  const vm = vnode.vm
  vm && delete vnode.vm
  return { dom, vm }
}
function createRef () {
  return { current: null }
}
export { render, createElement, Component, createRef }
