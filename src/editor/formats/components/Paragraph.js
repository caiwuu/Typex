/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-21 17:27:23
 */
import formater from '../index'
import Block from './Block'
export default class Paragraph extends Block {
  render() {
    return (
      <div>
        {/* {} */}
        {/* {} */}
        {/* {} */}
        一个段落：
        <span>{this.props.path.len ? formater.render(this.props.path.children) : <br />}</span>
      </div>
    )
  }
}
