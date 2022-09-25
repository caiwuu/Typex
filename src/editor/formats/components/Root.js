/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-22 10:02:43
 */
import formater from '../index'
import Block from './Block'
// 根组件
export default class Root extends Block {
  render() {
    const vn = (
      <div>
        {this.props.path.children.length
          ? formater.render(this.props.path.children)
          : this.state.placeholder(h)}
      </div>
    )
    return vn
  }
}
