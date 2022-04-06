import enqueueSetState from './enqueueSetState'
import createElement from '../createElement'
import { patch } from '../patch'
const propsKey = Symbol('props')
const insKey = Symbol('key')
export default class Component {
  static isConstructor = true
  static [insKey] = 0
  key = 0
  name = ''
  state = {}
  constructor(props) {
    this.key = Component[insKey]
    this[propsKey] = Object.freeze({ ...props })
    Component[insKey]++
  }
  get props() {
    return this[propsKey]
  }
  set props(k) {
    throw Error('props is readonly')
  }
  get dom() {
    return this.vnode.elm
  }
  set dom(k) {
    throw Error('dom is readonly')
  }
  setState(partialState) {
    console.log('setState')
    enqueueSetState(partialState, this)
  }
  _render_(h) {
    const vnode = this.render(h)
    if (vnode._isVnode) vnode.vm = this
    return vnode
  }
  _update_() {
    console.log('_update_')
    const oldVnode = this.vnode
    const newVnode = this._render_(createElement)
    this.vnode = newVnode
    patch(newVnode, oldVnode)
  }
  render() {
    throw Error('Component does not implement a required interface "render"')
  }
}
