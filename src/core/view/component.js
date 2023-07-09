/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 14:38:59
 */
import { default as h } from './vdom/createVnode'
import { getVnodeOrIns } from '../mappings'
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
   * @description 是否是组件
   * @readonly
   * @memberof Component
   * @instance
   */
  get isComponent () {
    return true
  }

  /**
   * @description 状态
   * @memberof Component
   * @instance
   */
  state = {}

  /**
   * @description nextTick
   * @param {function} fn
   * @memberof Component
   * @instance
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
   * @instance
   */
  render (h) {
    throw Error('Component does not implement a required interface "render"')
  }

  /**
   * @description 生成vdom
   * @param {*} h
   * @returns {*}
   * @instance
   * @private
   * @memberof Component
   */
  generateVdom (h) {
    typeof this.onBeforeRender === 'function' && this.onBeforeRender()
    return this.render(h)
  }
  /**
   * @description 设置状态，异步更新
   * @param {*} [partialState={}]
   * @returns {*}
   * @memberof Component
   * @instance
   */
  setState (partialState = {}) {
    return enqueueSetState(partialState, this)
  }

  /**
   * @description 同步更新
   * @memberof Component
   * @instance
   * @private
   */
  syncUpdate () {
    const oldVndoe = getVnodeOrIns(this)
    const oldVdom = oldVndoe.$vdom
    const newVdom = this.render(h)
    oldVndoe.$vdom = newVdom
    patch(newVdom, oldVdom)
  }

  /**
   * @description 控制组件是否需要更新
   * @returns {*}
   * @instance
   * @memberof Component
   */
  shouldComponentUpdate () {
    return true
  }
}
