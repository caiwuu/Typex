/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 13:54:10
 */
import { default as h } from './vdom/createVnode'
import { getVnOrIns } from '../mappings'
import patch from './vdom/patch'
import enqueueSetState from './vdom/enqueueSetState'
export default class Component {
  static isComponent = true
  state = {}
  $nextTick = (fn) => {
    return Promise.resolve().then(fn)
  }
  constructor(props) {
    this.props = Object.freeze({ ...props })
  }
  render(h) {
    throw Error('Component does not implement a required interface "render"')
  }
  setState(partialState = {}) {
    return enqueueSetState(partialState, this)
  }
  // 同步更新
  syncUpdate() {
    const oldVn = getVnOrIns(this)
    const newVn = this.render(h)
    patch(newVn, oldVn)
  }
}
