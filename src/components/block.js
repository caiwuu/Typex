import { Component } from '../core'

export class Block extends Component {
  render (h) {
    return h(
      'div',
      {
        style: 'color:#666;background:#eee;padding:6px 20px;margin-bottom:10px;border-radius: 5px;',
      },
      this.props.children.length ? this.props.children : '一个块...'
    )
  }
  componentDidMount () {
    console.log(this)
  }
}
