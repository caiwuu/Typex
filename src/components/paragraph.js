import { Component, createRef } from '../core/model/index'

export class Paragraph extends Component {
  render(h) {
    return h(
      'div',
      {
        style: 'color:#666;;padding:10px 20px;margin-bottom:16px;',
      },
      this.props.children.length ? this.props.children : '一个段落'
    )
  }
}
