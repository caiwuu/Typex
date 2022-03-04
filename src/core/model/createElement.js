import elementVNode from './elementVNode'
import textVNode from './textVNode'
import VNode from './vnode'
import { type, typeValidate } from '../share/utils'
export default function createElement(tagName, attrs = {}, children = []) {
  if (tagName instanceof VNode) return tagName
  if (type(tagName) === 'array') return tagName.map((ele) => createElement(ele, attrs))
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
      if (vn instanceof VNode) vn.vm = vm
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
