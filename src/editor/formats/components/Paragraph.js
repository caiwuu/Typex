/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-22 16:31:40
 */
import formater from '../index'
import Block from './Block'
import Static from './Static'
export default class Paragraph extends Block {
  render() {
    return (
      <div>
        <Static>
          <div>
            <span style='background:#ddd'>组件静态内容测试</span>
          </div>
        </Static>
        <editor-content>
          {/* {this.props.path.len ? formater.render(this.props.path.children) : <br />} */}
          {formater.render(this.props.path.children)}
          {this.props.path.len ? '' : <br />}
        </editor-content>
      </div>
    )
  }
}
