import { createElement as h, render, Component } from '../../core'
import { Block, Paragraph, Diseditable, Editable } from '../../components'
import './iconfont'
window.h = h
// 工具栏
class ToolBar extends Component {
  render(h) {
    const { tools } = this.props
    return h(
      'div',
      { style: 'background:rgb(40 40 40);padding:6px' },
      tools.map((ele) => h(ToolBarItem, { onCommand: this.onCommand, ...ele }))
    )
  }
  onCommand = (command) => {
    this.props.onCommand(command)
  }
}
// // 工具栏-元素
class ToolBarItem extends Component {
  constructor(props) {
    super(props)
    this.state = { value: true }
  }
  render(h) {
    return h(
      'span',
      {
        style: `color: ${this.state.value ? 'rgb(227 227 227)' : 'rgb(42 201 249)'};padding: 4px 10px;display: inline-block;border-radius: 4px;cursor: pointer;user-select: none;`,
        onClick: this.click,
      },
      [h('svg', { class: 'icon', 'aria-hidden': true, ns: 'http://www.w3.org/2000/svg' }, h('use', { 'xlink:href': this.props.icon }))]
    )
  }
  click = () => {
    this.props.onCommand(this.props.command)
    this.setState({
      value: !this.state.value,
    })
  }
}
// UI外框
class Wrappe extends Component {
  render(h) {
    return h('div', { style: 'border:solid 1px #eee;' }, [h(this.props.ToolBar), h(this.props.Body)])
  }
  // componentDidMount() {
  //   console.log(this)
  // }
}
// 编辑区
class Body extends Component {
  render(h) {
    return h(
      'div',
      h('div', { style: 'padding:16px;min-height: 200px;', id: 'editor-content', isRoot: true }, [
        h(Block),
        h(Paragraph, ['普通文本1', '普通文本2', h('span', { style: 'color:red' }, [h('strong', '加粗文本'), h('em', '加粗斜体文本')]), '普通文本4']),
        // 第一种写法
        h(Paragraph, h(Diseditable, [h(Editable, '可编辑文字😂'), h('span', { style: 'color:red' }, '不可编辑'), h(Editable, '可编辑文字😂'), h(Editable, '可编辑文字😂')])),
        // 第二种写法
        h(Paragraph, ['可编辑文字😂', h(Diseditable, h('span', { style: 'color:red' }, '不可编辑')), '可编辑文字😂', '可编辑文字😂']),
        h(Paragraph, [h('span', { style: 'color:red' }, '红色文字')]),
      ])
    )
  }
  // componentDidMount() {
  //   console.log(this)
  // }
}

export default class UI {
  constructor(editor) {
    this.editor = editor
  }
  render() {
    this.body = h(Body)
    this.toolBar = h(ToolBar, {
      tools: [...this.editor.tools],
      onCommand: (command) => this.editor.execComand(command),
    })
    this.vnode = h(Wrappe, {
      ToolBar: this.toolBar,
      Body: this.body,
    })
    render(this.vnode, document.getElementById(this.editor.host))
  }
}
