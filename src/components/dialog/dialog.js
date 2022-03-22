import { Component } from '../../core/model/index'

export class Dialog extends Component {
  constructor(props) {
    super(props)
    this.state = { visiable: false }
  }
  render() {
    return (
      <div>
        {this.state.visiable ? (
          <div style='background:#ddd;height:200px;position:absolute;top:200px;width:300px'>
            {this.props.children.length ? this.props.children : 'dialog'}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
  toggle() {
    this.setState({ visiable: !this.state.visiable })
  }
}
