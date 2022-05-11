import { createElement as h, mount, Component, createRef } from '../../core'
import { Block, Paragraph, Diseditable, Editable, Dialog, Tooltip } from '../../components'
import './iconfont'
window.h = h
// 工具栏
class ToolBar extends Component {
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
// UI外框
class Wrappe extends Component {
  render() {
    return (
      <div class='editor-wrappe'>
        {this.props.ToolBar}
        {this.props.Body}
      </div>
    )
  }
}
// 编辑区
class Body extends Component {
  render() {
    return (
      <div>
        <div id='editor-content' isRoot={true}>
          <Block>1.0内核测试版本</Block>
          <Paragraph>
            <Diseditable>
              <span style='color:green'>不可编辑文本</span>
            </Diseditable>
            可编辑文本
            <strong>加粗文本</strong>
            <del>删除线</del>
            <u>删除线</u>
          </Paragraph>
          <Paragraph>
            <Diseditable>
              <strong style='color:red'>重要变更:</strong>
            </Diseditable>
          </Paragraph>
          <Paragraph>
            内核重构中,该版本所有功能暂停开发--
            <a href='https://github.com/caiwuu/editor-core'>新内核地址</a>
          </Paragraph>
        </div>
      </div>
    )
  }
}

export default class UI {
  constructor(editor) {
    this.editor = editor
  }
  render() {
    this.body = <Body></Body>
    this.toolBar = (
      <ToolBar
        tools={[...this.editor.tools]}
        onCommand={(command, ...args) => this.editor.execComand(command, ...args)}
      ></ToolBar>
    )
    this.vnode = <Wrappe ToolBar={this.toolBar} Body={this.body}></Wrappe>
    mount(this.vnode, document.getElementById(this.editor.host))
  }
}
