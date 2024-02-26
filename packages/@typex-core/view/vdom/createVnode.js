import { isPrimitive, isUndef, styleToObj, uuid, mergeObj, isClass, isFunction } from '../../utils'
const BUILTINPROPSKEY = ['ref', 'key', 'ns'] //不包含在props中的属性
const INHERITPROPSKEY = ['ns'] // 需要继承的属性

/**
 * @description 创建虚拟dom
 * @export
 * @param {*} type
 * @param {*} [config={}]
 * @param {*} [children=[]]
 * @returns {*}
 */
export default function createVnode(type, config, children = []) {
  config = config || {}
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

const _genChildren = (children, inherit) => {
  return children
    // 排除一些内容为''的子元素
    .filter((ele) => ele!=='')
    .map((ele) => {
      if (isPrimitive(ele) || isUndef(ele)) {
        return {
          _uuid: uuid(),
          type: 'text',
          vnodeType: 3,
          children: ele,
        }
      } else {
        mergeObj(ele, inherit)
        return ele
      }
    })
}

/**
 * @description 虚拟节点工厂函数
 * @param {*} type
 * @param {*} builtinProps
 * @param {*} props
 * @param {*} children
 * @returns {*}
 */
function Element(type, builtinProps, props, children) {
  let element
  if (type === 'text') {
    element = {
      _uuid: uuid(),
      vnodeType: 3,
      type: 'text',
      children: children.join(''),
    }
  } else {
    element = {
      _uuid: uuid(),
      vnodeType: isClass(type) ? 2 : isFunction(type) ? 1 : 4,
      type,
      ...builtinProps,
      props,
    }

    const inherit = {}
    for (let propName of INHERITPROPSKEY) {
      inherit[propName] = element[propName]
    }
    if (element.vnodeType === 1 || element.vnodeType === 2) {
      element.props.children = _genChildren(children, inherit)
    } else {
      element.children = _genChildren(children, inherit)
    }
  }
  return element
}