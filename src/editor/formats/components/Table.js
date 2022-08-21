/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:05:01
 */
import { Content, createRef } from '@/core'
import formater from '..'
import Block from './Block'
export class Table extends Content {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.state.path.children)}
      </table>
    )
  }
}
export class Row extends Content {
  render() {
    return <tr>{formater.render(this.state.path.children)}</tr>
  }
}
export class Col extends Block {
  constructor(props) {
    super(props)
    this.state._$root = createRef()
  }
  render() {
    return (
      <td ref={this.state._$root} style='text-align:center;width:50%'>
        {this.state.path.len ? formater.render(this.state.path.children) : <br />}
      </td>
    )
  }
}
