import { createElement as h, render, Component } from '../../core/model'
import { Block, Paragraph, Content, Diseditable, Editable } from '../../components'
// 工具栏
class ToolBar extends Component {
  render(h) {
    const { tools } = this.props
    return h(
      'div',
      { style: 'background:#eee;padding:6px' },
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
    this.state = { value: false }
  }
  render(h) {
    return h(
      'span',
      {
        style: `color: rgb(153, 153, 153);font-size: 12px;padding: 4px 13px;background: #e1e2e3;display: inline-block;border-radius: 4px;margin-right:10px;cursor: pointer;user-select: none;box-shadow: 1px 2px 3px #b7bbbd;font-weight:${
          this.state.value ? 'bold' : ''
        }`,
        onClick: this.click,
      },
      this.props.label
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
  componentDidMount() {
    console.log(this)
  }
}
// 编辑区
class Body extends Component {
  render(h) {
    console.log(h(Editable, '2222'))
    return h(
      'div',
      h('div', { style: 'padding:16px;min-height: 200px;' }, [
        h(Block),
        h(Paragraph, h(Diseditable, [h('span', { style: 'color:red' }, '1111'), h(Editable, '2222')])),
      ])
    )
  }
  componentDidMount() {
    console.log(this)
  }
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
    render(
      h(Wrappe, {
        ToolBar: this.toolBar,
        Body: this.body,
      }),
      document.getElementById(this.editor.host)
    )
  }
}
