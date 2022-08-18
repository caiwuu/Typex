/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:04:57
 */
import { formater } from '..'
import Block from './Block'
// 根组件
export default class Root extends Block {
  render() {
    return (
      <div id='editor-content'>
        {this.state.marks.length ? formater.render(this.state.marks) : this.state.placeholder(h)}
      </div>
    )
  }
}
