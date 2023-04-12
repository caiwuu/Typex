/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:21:46
 */
import formater from '../index'
import Block from './block'
// 根组件
export default class Root extends Block {
  render () {
    const vn = (
      <div>
        {this.$path.children.length ? this.renderContent : this.state.placeholder(h)}
      </div>
    )
    return vn
  }
}
