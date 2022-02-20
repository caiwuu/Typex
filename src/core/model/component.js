const propsKey = Symbol('props')
export default class Component {
  static isConstructor = true
  name = ''
  constructor(props) {
    if (props.onRef && typeof props.onRef === 'function') {
      props.onRef(this)
    }
    this[propsKey] = props
  }
  get props() {
    return this[propsKey]
  }
  set props(k) {
    throw Error('props is readonly')
  }
  render() {
    throw Error('Component does not implement a required interface "render"')
  }
}
