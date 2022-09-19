/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-19 14:39:58
 */
import { createRef } from '@/core'
import formater from '..'
import Block from './Block'
export class Table extends Block {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.props.path.children)}
      </table>
    )
  }
}
export class Row extends Block {
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
