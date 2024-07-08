import { Component, createRef } from '@typex/core'
import './iconfont'
import { Tooltip, DialogContent } from './compinents'

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
    this.state = { active: false, dialogVisiable: false }
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
  getStyleColor () {
    if (!this.state.active) return 'rgb(227 227 227);'
    if (this.props.name === 'color') return 'rgb(227 227 227);'
    return 'rgb(42 201 249)'
  }
  render () {
    return (
      <div
        class='editor-tool-bar-item'
        ref={this.barItemRef}
        style={`color: ${this.getStyleColor()}`}
      >
        <svg onClick={this.clickHandle} class='icon' aria-hidden ns='http://www.w3.org/2000/svg'>
          <use xlink:href={this.props.icon}></use>
        </svg>
        {
          this.props.name === 'color' ? <span class="color-line" style={`background:${this.state.active ? this.state.active : '#000'}`}></span> : ''
        }
        {
          this.props.showDialog && this.state.dialogVisiable
            ?
            <div style='background:#efefef;position:absolute;top:35px;z-index:1'>
              <DialogContent onOk={this.onOk} name={this.props.name}></DialogContent>
            </div>
            : ''
        }
      </div>
    )
  }

  onOk = (val) => {
    this.toggle()
    this.emitComand(val)
  }
  outClickHandle = (e) => {
    if (this.barItemRef.current.contains(e.target)) return
    this.setState({ dialogVisiable: false })
    document.removeEventListener('click', this.outClickHandle)
  }
  toggle () {
    if (!this.state.dialogVisiable) {
      document.addEventListener('click', this.outClickHandle)
    }
    this.setState({ dialogVisiable: !this.state.dialogVisiable })
  }
  emitComand = (val) => {
    this.props.editor.command(this.props.name, val)
  }

  clickHandle = () => {
    if (this.props.showDialog) {
      this.toggle()
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
