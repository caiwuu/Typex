const propsKey = Symbol('props')
export default class Component {
  static isConstructor = true
  name = ''
  constructor(props) {
    this[propsKey] = props
  }
  get props() {
    return this[propsKey]
  }
  set props(v) {
    throw Error('props is readonly')
  }
  render() {
    throw Error('Component does not implement a required interface "render"')
  }
}
