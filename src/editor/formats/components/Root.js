/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-01 11:10:24
 */
import formater from '../index'
import Block from './Block'
// 根组件
export default class Root extends Block {
  render() {
    const vn = (
      <div id='editor-content'>
        {this.props.path.children.length
          ? formater.render(this.props.path.children)
          : this.state.placeholder(h)}
      </div>
    )
    return vn
  }
}
