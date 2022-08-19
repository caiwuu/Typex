/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:04:51
 */
import { formater } from '..'
import Block from './Block'
export default class Paragraph extends Block {
  render() {
    return <div>{this.contentLength ? formater.render(this.state.path) : <br />}</div>
  }
}
