import { Component, createRef } from '@typex/core'
import './iconfont'
import './toolBar.styl'
import { Dialog,Tooltip,DialogContent } from './compinents'
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
  onCommand = (commandName, ...args) => {
    this.props.onCommand(commandName, ...args)
  }
}
// // 工具栏-元素
class ToolBarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
    this.props.toolBarItems.push(this)
    this.dialogRef = createRef()
  }
  onNotice(commonKeyValue) {
    if (commonKeyValue[this.props.commandName] !== this.state.active) {
      this.setState({
        active: commonKeyValue[this.props.commandName],
      })
    }
  }
  render() {
    return (
      <span
        onClick={this.clickHandle}
        class='editor-tool-bar-item'
        style={`color: ${!this.state.active ? 'rgb(227 227 227);' : 'rgb(42 201 249)'};`}
      >
        <svg class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        {
          this.props.options
          ?
            <Dialog ref={this.dialogRef}>
              <DialogContent name={this.props.commandName} options={this.props.options}></DialogContent>
            </Dialog>
          :''
        }
      </span>
    )
  }
  emitComand = ()=>{
    this.props.editor.command(this.props.commandName)
  }
  clickHandle = (e) => {
    e.stopPropagation()
    this.setState({
      active: !this.state.active,
    })
    if(this.dialogRef.current){
      this.dialogRef.current.toggle()
    }else{
      this.emitComand()
    }
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
