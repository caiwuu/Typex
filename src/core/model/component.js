import { update } from './render'
const propsKey = Symbol('props')
const insKey = Symbol('key')
export default class Component {
  static isConstructor = true
  static [insKey] = 0
  static key = 0
  name = ''
  state = {}
  constructor(props) {
    this.key = Component[insKey]
    this[propsKey] = Object.freeze({ ...props })
    Component[insKey]++
  }
  get props () {
    return this[propsKey]
  }
  set props (k) {
    throw Error('props is readonly')
  }
  get dom () {
    return this.vnode.ele
  }
  set dom (k) {
    throw Error('dom is readonly')
  }
  setState (state) {
    this.state = Object.assign(this.state, state)
    // 这里暂时同步更新，不做优化
    update(this)
  }
  render () {
    throw Error('Component does not implement a required interface "render"')
  }
}
