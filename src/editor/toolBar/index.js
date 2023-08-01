import { Component, createRef } from '@/core'
import './iconfont'
import './toolBar.styl'
// 工具栏
export default class ToolBar extends Component {
  toolBarItems = []
  constructor(props) {
    super(props)
    this.props.editor.on('selectionchange', (ops) => {
      const { startContainer, endContainer } = ops
      const selectLeafs = []
      let current = startContainer
      while (1) {
        selectLeafs.push(current)
        if (current === endContainer) break
        current = current.nextLeaf
      }
      const commonKeyValue = findCommonKeyValuePairs(selectLeafs.map((ele) => ele.node.formats))
      this.notice(commonKeyValue)
    })
  }
  notice(commonKeyValue) {
    this.toolBarItems.forEach((item) => item.onNotice(commonKeyValue))
  }
  render() {
    const { tools } = this.props
    return (
      <div class='editor-tool-bar'>
        {tools.map((ele) => (
          <Tooltip width='64' content={ele.tooltip}>
            <ToolBarItem
              {...{ ...ele, onCommand: this.onCommand, toolBarItems: this.toolBarItems }}
            ></ToolBarItem>
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
    this.state = { value: false }
    this.props.toolBarItems.push(this)
    this.dialogRef = createRef()
  }
  onNotice(commonKeyValue) {
    if (commonKeyValue[this.props.command] !== this.state.value) {
      this.setState({
        value: commonKeyValue[this.props.command],
      })
    }
  }
  render() {
    return (
      <span
        onClick={this.click}
        class='editor-tool-bar-item'
        style={`color: ${!this.state.value ? 'rgb(227 227 227);' : 'rgb(42 201 249)'};`}
      >
        <svg class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        <Dialog ref={this.dialogRef}>
          <span style='color:red'>dialog</span>
        </Dialog>
      </span>
    )
  }
  click = () => {
    this.dialogRef.current.toggle()
    this.setState({
      value: !this.state.value,
    })
    this.props.editor.command(this.props.command)
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
          <div style='background:#ddd;height:200px;position:absolute;top:35px;width:300px;z-index:1'>
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
function findCommonKeyValuePairs(lists) {
  if (lists.length === 0) return {}

  const commonPairs = {}

  for (const key in lists[0]) {
    const value = lists[0][key]

    if (lists.every((obj) => obj[key] === value)) {
      commonPairs[key] = value
    }
  }

  return commonPairs
}
