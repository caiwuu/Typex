import { Component, createRef } from '../core/model/index'

export class Block extends Component {
  render(h) {
    return h(
      'div',
      {
        style: 'color:#666;background:#eee;padding:10px;margin:16px',
      },
      this.props.children
    )
  }
  componentDidMount() {
    console.log(this.dom)
  }
}
