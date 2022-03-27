import { Component } from '../core/model/index'

export class Paragraph extends Component {
  render() {
    return (
      <div style='padding:6px 20px;'>
        {this.props.children.length ? this.props.children : '一个段落'}
      </div>
    )
  }
}
