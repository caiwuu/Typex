/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 14:38:59
 */
import { default as h } from './vdom/createVnode'
import { getVnOrIns } from '../mappings'
import patch from './vdom/patch'
import enqueueSetState from './vdom/enqueueSetState'


/**
 * @description 组件类
 * @export
 * @class Component
 */
export default class Component {

  /**
   * @description 是否是组件
   * @static
   * @memberof Component
   */
  static isComponent = true

  /**
   * @description 状态
   * @memberof Component
   */
  state = {}

  /**
   * @description nextTick
   * @param {function} fn
   * @memberof Component
   */
  $nextTick = (fn) => {
    return Promise.resolve().then(fn)
  }
  constructor(props) {
    this.props = Object.freeze({ ...props })
  }

  /**
   * @description 渲染函数
   * @param {*} h
   * @memberof Component
   */
  render (h) {
    throw Error('Component does not implement a required interface "render"')
  }

  /**
   * @description 设置状态，异步更新
   * @param {*} [partialState={}]
   * @returns {*}  
   * @memberof Component
   */
  setState (partialState = {}) {
    return enqueueSetState(partialState, this)
  }

  /**
   * @description 同步更新
   * @memberof Component
   */
  syncUpdate () {
    const oldVn = getVnOrIns(this)
    const newVn = this.render(h)
    patch(newVn, oldVn)
  }
}
