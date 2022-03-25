import { createElement as h, mount, Component, createRef } from '../../core'
import { Block, Paragraph, Diseditable, Editable, Dialog } from '../../components'
import './iconfont'
window.h = h
// 工具栏
class ToolBar extends Component {
  constructor(props) {
    super(props)
    this.dialogRef = createRef()
  }
  render() {
    const { tools } = this.props
    return (
      <div style='background:rgb(40 40 40);padding:6px'>
        {tools.map((ele) => (
          <ToolBarItem {...{ ...ele, onCommand: this.onCommand }}></ToolBarItem>
        ))}
        <Dialog ref={this.dialogRef}>
          <span style='color:red'>dialog</span>
        </Dialog>
      </div>
    )
  }
  onCommand = (command, ...args) => {
    this.props.onCommand(command, ...args)
    // this.dialogRef.current.toggle()
  }
}
// // 工具栏-元素
class ToolBarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { value: true }
  }
  render() {
    return (
      <span
        onClick={this.click}
        style={`color: ${
          this.state.value ? 'rgb(227 227 227)' : 'rgb(42 201 249)'
        };padding: 4px 10px;display: inline-block;border-radius: 4px;cursor: pointer;user-select: none;`}
      >
        <svg class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
      </span>
    )
  }
  click = () => {
    console.log('click')
    this.props.onCommand('fontStyle', this.props.command, true)
    this.setState({
      value: !this.state.value,
    })
  }
}
// UI外框
class Wrappe extends Component {
  render() {
    return (
      <div style='border:solid 1px #eee;'>
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
        <div style='padding:16px;min-height: 200px;' id='editor-content' isRoot={true}>
          <Block></Block>
          <Paragraph>
            普通文本1普通文本2
            <span style='color:red'>
              <strong>加粗文本</strong>
              <em>斜体文本</em>
            </span>
            普通文本4
          </Paragraph>
          <Paragraph>
            <Diseditable>
              <Editable>可编辑文字😂</Editable>
              <span style='color:red'>不可编辑</span>
              <Editable>可编辑文字😂</Editable>
              <Editable>可编辑文字😂</Editable>
            </Diseditable>
          </Paragraph>
          <Paragraph>
            可编辑文字😂
            <Diseditable>
              <span style='color:red'>不可编辑</span>
            </Diseditable>
            可编辑文字😂 可编辑文字😂
          </Paragraph>
          <Paragraph>
            <span style='color:red'>红色文字红色文字</span>
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
