const propsKey = Symbol('props')
export default class Component {
  static isConstructor = true
  name = ''
  constructor(props) {
    this[propsKey] = props
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
  render () {
    throw Error('Component does not implement a required interface "render"')
  }
}
