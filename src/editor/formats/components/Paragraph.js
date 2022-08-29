/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:04:51
 */
import formater from '../index'
import Block from './Block'
export default class Paragraph extends Block {
  render() {
    return <div>{this.props.path.len ? formater.render(this.props.path.children) : <br />}</div>
  }
}
