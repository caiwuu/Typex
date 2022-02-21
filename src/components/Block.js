import { Component, createRef } from '../core/model/index'

export class Block extends Component {
  render (h) {
    return h(
      'div',
      {
        style: 'color:#666;background:#eee;padding:10px 20px;margin-bottom:16px;border-radius: 4px;',
      },
      this.props.children.length ? this.props.children : h('p', '一个块...')
    )
  }
  componentDidMount () {
    // console.log(this.dom)
  }
}
