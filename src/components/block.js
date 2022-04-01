import { Component } from '../core'
export class Block extends Component {
  render() {
    return (
      <div class='editor-block'>
        {this.props.children.length ? this.props.children : '一个块...'}
      </div>
    )
  }
  onMounted() {
    console.log(this)
  }
}
