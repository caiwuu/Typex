/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-26 14:57:45
 */
import formater from '../index'
import Block from './Block'
import Static from './Static'
export default class Paragraph extends Block {
  render() {
    return (
      <div>
        {/* <Static> */}
        {/* <div>
            <span style='background:#ddd'>静态内容 不可编辑 不可选中 它是组件的一部分</span>
          </div> */}
        {/* <div>
            <span style='background:#ddd'>只有通过formater.render的内容才能被编辑</span>
          </div> */}
        {/* </Static> */}
        {/* <editor-content> */}
        {formater.render(this.props.path.children, this.props.path.len)}
        {/* </editor-content> */}
      </div>
    )
  }
}
