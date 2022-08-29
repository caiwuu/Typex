/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 13:42:33
 */
import { Content, createRef } from '@/core'
import formater from '..'
import Block from './Block'
export class Table extends Content {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.props.path.children)}
      </table>
    )
  }
}
export class Row extends Content {
  render() {
    return <tr>{formater.render(this.props.path.children)}</tr>
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
        {this.props.path.len ? formater.render(this.props.path.children) : <br />}
      </td>
    )
  }
}
