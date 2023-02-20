import { isPrimitive, isUndef, styleToObj, uuid, mergeObj } from '../../utils'
const BUILTINPROPSKEY = ['ref', 'key', 'ns']
const insertedInsQueue = []
const INHERITPROPSKEY = ['ns']

export default function createVnode(type, config = {}, children = []) {
  const props = {}
  const builtinProps = {}
  for (let propName of BUILTINPROPSKEY) {
    builtinProps[propName] = config[propName] || null
  }
  for (let propName in config) {
    if (!BUILTINPROPSKEY.includes(propName)) {
      if (propName === 'style' && isPrimitive(config[propName])) {
        props[propName] = styleToObj(config[propName])
      } else {
        props[propName] = config[propName]
      }
    }
  }
  return Element(type, builtinProps, props, children.flat())
}
const genChildren = (children, inherit) =>
  children.map((ele) => {
    if (isPrimitive(ele) || isUndef(ele)) {
      return {
        _isVnode: true,
        type: 'text',
        children: ele,
      }
    } else {
      mergeObj(ele, inherit)
      return ele
    }
  })
function Element(type, builtinProps, props, children) {
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
      ...builtinProps,
      props,
    }
    const inherit = {}
    for (let propName of INHERITPROPSKEY) {
      inherit[propName] = element[propName]
    }
    if (typeof type === 'function') {
      element.props.children = genChildren(children, inherit)
    } else {
      element.children = genChildren(children, inherit)
    }
  }
  return element
}

export { insertedInsQueue }
