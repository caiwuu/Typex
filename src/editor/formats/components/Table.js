/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:35:56
 */
import { createRef } from '@/core'
import formater from '..'
import Block from './Block'
export class Table extends Block {
  render() {
    return (
      <table border='1' style='border-collapse:collapse;width:600px'>
        {formater.render(this.props.path)}
      </table>
    )
  }
}
export class Row extends Block {
  render() {
    return <tr>{formater.render(this.props.path)}</tr>
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
        {formater.render(this.props.path)}
      </td>
    )
  }
}
