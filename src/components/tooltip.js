import { Component } from '../core'
export class Tooltip extends Component {
  render() {
    return (
      <div class='editor-tooltip'>
        {this.props.children.length ? this.props.children : ''}
        <span
          class='tooltiptext top'
          style={`width:${this.props.width}px;margin-left:-${this.props.width / 2}px;`}
        >
          {this.props.content || 'content'}
        </span>
      </div>
    )
  }
}
