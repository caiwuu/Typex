import { isPrimitive, isUndef, styleToObj, uuid } from '../../utils'
const BUILTINPROPS = ['ref', 'key', 'ns']
const insertedInsQueue = []

export default function createVnode(type, config = {}, children = []) {
  const props = {}
  const ref = config.ref || null
  const key = config.key || null
  for (let propName in config) {
    if (!BUILTINPROPS.includes(propName)) {
      if (propName === 'style' && isPrimitive(config[propName])) {
        props[propName] = styleToObj(config[propName])
      } else {
        props[propName] = config[propName]
      }
    }
  }
  return Element(type, key, ref, props, children.flat())
}
const genChildren = (children) =>
  children.map((ele) => {
    if (isPrimitive(ele) || isUndef(ele)) {
      return {
        _isVnode: true,
        type: 'text',
        children: ele,
      }
    } else {
      return ele
    }
  })
function Element(type, key, ref, props, children) {
  let element
  if (type === 'text') {
    element = {
      _uuid: uuid(),
      _isVnode: true,
      type: 'text',
      children: children.join(''),
    }
  } else {
    element = {
      _uuid: uuid(),
      _isVnode: true,
      type,
      key,
      ref,
      props,
    }
    if (typeof type === 'function') {
      element.props.children = genChildren(children)
    } else {
      element.children = genChildren(children)
    }
  }
  // if (Object.freeze) Object.freeze(props)
  return element
}

export { insertedInsQueue }
