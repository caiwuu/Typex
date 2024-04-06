import { Component, createRef } from '@typex/core'
export class Dialog extends Component {
  constructor(props) {
    super(props)
    this.state = { visiable: false }
    this.dialogRef = createRef()
  }
  render () {
    return (
      <div ref={this.dialogRef}>
        {this.state.visiable ? (
          <div style='background:#ddd;position:absolute;top:35px;z-index:1'>
            {this.props.children.length ? this.props.children : 'dialog'}
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
  outClickHandle = (e) => {
    if (this.props.barItemRef.current.contains(e.target)) return
    this.setState({ visiable: false })
    document.removeEventListener('click', this.outClickHandle)
  }
  toggle () {
    if (!this.state.visiable) {
      document.addEventListener('click', this.outClickHandle)
    }
    this.setState({ visiable: !this.state.visiable })
  }
}