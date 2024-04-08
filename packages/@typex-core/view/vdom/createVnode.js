import { isPrimitive, isUndef, styleToObj, uuid, mergeObj, isClass, isFunction } from '../../utils'
import { vnodeType } from '../../constDefine'
const BUILTINPROPSKEY = ['ref', 'key', 'ns'] //不包含在props中的属性
const INHERITPROPSKEY = ['ns'] // 需要继承的属性
const { VFUNCTION, VCOMPONENT, VTEXT, VDOM } = vnodeType
/**
 * @description 创建虚拟dom
 * @export
 * @param {*} tag
 * @param {*} [config={}]
 * @param {*} [children=[]]
 * @returns {*}
 */
export default function createVnode (tag, config, children = []) {
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
  return Element(tag, builtinProps, props, children.flat())
}

const _genChildren = (children, inherit) => {
  return children
    // 排除一些内容为''的子元素
    .filter((ele) => ele !== '')
    .map((ele) => {
      if (isPrimitive(ele) || isUndef(ele)) {
        return {
          _uuid: uuid(),
          tag: 'text',
          vnodeType: VTEXT,
          children: ele,
        }
      } else {
        mergeObj(ele, inherit)
        return ele
      }
    })
}

function Element (tag, builtinProps, props, children) {
  let element
  if (tag === 'text') {
    element = {
      _uuid: uuid(),
      vnodeType: VTEXT,
      tag: 'text',
      children: children.join(''),
    }
  } else {
    element = {
      _uuid: uuid(),
      vnodeType: isClass(tag) ? VCOMPONENT : isFunction(tag) ? VFUNCTION : VDOM,
      tag,
      ...builtinProps,
      props,
    }

    const inherit = {}
    for (let propName of INHERITPROPSKEY) {
      inherit[propName] = element[propName]
    }
    if (element.vnodeType === VFUNCTION || element.vnodeType === VCOMPONENT) {
      element.props.children = _genChildren(children, inherit)
    } else {
      element.children = _genChildren(children, inherit)
    }
  }
  return element
}
