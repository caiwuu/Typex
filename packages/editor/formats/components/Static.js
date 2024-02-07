/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-22 16:32:13
 */
import { Component } from '@typex/core'
export default class Static extends Component {
  render() {
    return <editor-static style='user-select:none;'>{this.props.children}</editor-static>
  }
}
