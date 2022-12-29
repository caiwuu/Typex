import { Component, createRef } from '@/core'
import './iconfont'
import './toolBar.styl'
// 工具栏
export default class ToolBar extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { tools } = this.props
    return (
      <div class='tool-bar'>
        {tools.map((ele) => (
          <Tooltip width='64' content={ele.tooltip}>
            <ToolBarItem {...{ ...ele, onCommand: this.onCommand }}></ToolBarItem>
          </Tooltip>
        ))}
      </div>
    )
  }
  onCommand = (command, ...args) => {
    this.props.onCommand(command, ...args)
  }
}
// // 工具栏-元素
class ToolBarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { value: true }
    this.dialogRef = createRef()
  }
  render() {
    return (
      <span
        onClick={this.click}
        class='tool-bar-item'
        style={`color: ${this.state.value ? 'rgb(227 227 227);' : 'rgb(42 201 249)'};`}
      >
        <svg class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        {/* <Dialog ref={this.dialogRef}>
            <span style='color:red'>dialog</span>
          </Dialog> */}
      </span>
    )
  }
  click = () => {
    console.log('click')
    this.setState({
      value: !this.state.value,
    })
    this.props.onCommand('fontStyle', this.props.command, true)
    // this.dialogRef.current.toggle()
  }
}

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
export class Dialog extends Component {
  constructor(props) {
    super(props)
    this.state = { visiable: false }
  }
  render() {
    return (
      <div>
        {this.state.visiable ? (
          <div style='background:#ddd;height:200px;position:absolute;top:200px;width:300px;z-index:1'>
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
