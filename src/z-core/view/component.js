/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 14:34:22
 */
import { default as h } from './vdom/createVnode'
import { getVnOrIns } from '../mappings'
import patch from './vdom/patch'
import enqueueSetState from './vdom/enqueueSetState'
export default class Component {
  static isComponent = true
  constructor(props) {
    this.props = Object.freeze({ ...props })
  }
  render(h) {
    throw Error('Component does not implement a required interface "render"')
  }
  setState(partialState = {}) {
    return enqueueSetState(partialState, this)
  }
  syncUpdate() {
    const oldVn = getVnOrIns(this)
    const newVn = this.render(h)
    patch(newVn, oldVn)
  }
}
