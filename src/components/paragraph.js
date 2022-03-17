import { Component } from '../core/model/index'

export class Paragraph extends Component {
  render(h) {
    return h(
      'div',
      {
        style: 'color:#666;;padding:6px 20px;',
      },
      this.props.children.length ? this.props.children : '一个段落'
    )
  }
}
