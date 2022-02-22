import elementVNode from './elementVNode'
import Component from './component'
import textVNode from './textVNode'
import VNode from './vnode'
import { type, typeValidate } from '../share/utils'
function createElement(tagName, attrs = {}, children = []) {
  if (tagName instanceof VNode) return tagName
  // if (type(tagName) === 'array') return tagName.map((ele) => createElement(ele, attrs))
  if (type(attrs) !== 'object' || attrs instanceof VNode) {
    children = [attrs].flat()
    attrs = {}
  } else {
    children = [children].flat()
  }
  typeValidate(tagName, ['string', 'function'], "argument 'tagName' expect 'string'|'function'|'vnode'")
  if (typeof tagName === 'function') {
    const mergedAttrs = {
      ...attrs,
      children: children.flat().map((ele) => {
        if (type(ele) === 'string' || type(ele) === 'number') {
          return new textVNode(String(ele))
        } else {
          return ele
        }
      }),
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
      return tagName(createElement, mergedAttrs)
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
  const doms = [vnode].flat().map((i) => renderDom(i))
  doms.forEach((e) => {
    root.appendChild(e.dom)
    e.vm && e.vm.componentDidMount && e.vm.componentDidMount()
  })
}
function renderDom(vnode) {
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
function createRef() {
  return { current: null }
}
export { render, createElement, Component, createRef, renderDom }
