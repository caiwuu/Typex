/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:04:57
 */
import formater from '../index'
import Block from './Block'
// 根组件
export default class Root extends Block {
  render() {
    const vn = (
      <div id='editor-content'>
        {this.state.path.children.length
          ? formater.render(this.state.path.children)
          : this.state.placeholder(h)}
      </div>
    )
    console.log(vn)
    return vn
  }
}
