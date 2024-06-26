import { Component, createRef } from '@typex/core'
import './iconfont'
import { Dialog, Tooltip, DialogContent } from './compinents'

// 工具栏
export default class ToolBar extends Component {
  toolBarItemInses = []

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
      const seletBlocks = [...new Set(selectLeafs.map(ele => ele.block.$path))]
      const commonKeyValueWithLeaf = findCommonKeyValuePairs(selectLeafs.map((ele) => ele.node.formats))
      const commonKeyValueWithBlock = findCommonKeyValuePairs(seletBlocks.map((ele) => ele.node.formats))
      this.notice(Object.assign({}, commonKeyValueWithLeaf, commonKeyValueWithBlock))
    })
  }

  notice (commonKeyValue) {
    console.log(commonKeyValue);
    this.toolBarItemInses.forEach((item) => item.onNotice(commonKeyValue))
  }

  render () {
    const { tools } = this.props
    return (
      <div class='editor-tool-bar'>
        {tools.map((ele) => (
          <Tooltip width='64' content={ele.tooltip}>
            <ToolBarItem
              {...{ ...ele, onCommand: this.onCommand, toolBarItemInses: this.toolBarItemInses }}
            ></ToolBarItem>
          </Tooltip>
        ))}
      </div>
    )
  }

  onCommand = (name, ...args) => {
    this.props.onCommand(name, ...args)
  }
}
// // 工具栏-元素
class ToolBarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { active: false }
    this.props.toolBarItemInses.push(this)
    this.dialogRef = createRef()
    this.barItemRef = createRef()
  }

  onNotice (commonKeyValue) {
    if (commonKeyValue[this.props.name] !== this.state.active) {
      this.setState({
        active: commonKeyValue[this.props.name],
      })
    }
  }

  render () {
    return (
      <span
        class='editor-tool-bar-item'
        ref={this.barItemRef}
        style={`color: ${!this.state.active ? 'rgb(227 227 227);' : 'rgb(42 201 249)'};`}
      >
        <svg onClick={this.clickHandle} class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        {
          this.props.showDialog
            ?
            <Dialog ref={this.dialogRef} barItemRef={this.barItemRef}>
              <DialogContent onOk={this.onOk} name={this.props.name}></DialogContent>
            </Dialog>
            : ''
        }
      </span>
    )
  }

  onOk = (val) => {
    this.dialogRef.current.toggle()
    this.emitComand(val)
  }

  emitComand = (val) => {
    this.props.editor.command(this.props.name, val)
  }

  clickHandle = () => {
    if (this.dialogRef.current) {
      this.dialogRef.current.toggle()
    } else {
      this.emitComand()
    }
  }
}


function findCommonKeyValuePairs (lists) {
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
