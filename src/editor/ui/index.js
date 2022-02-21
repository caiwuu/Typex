import { createElement as h, render, Component } from '../../core/model'
import { Block, Paragraph } from '../../components'
class ToolBar extends Component {
  render (h) {
    const { tools } = this.props
    return h('div', { style: 'background:#eee;padding:6px' },
      tools.map(ele => h(ToolBarItem, { onCommand: this.onCommand, ...ele }))
    )
  }
  onCommand = (command) => {
    this.props.onCommand(command)
  }
}
class ToolBarItem extends Component {
  render (h) {
    return h('span',
      {
        style: 'color: rgb(153, 153, 153);font-size: 12px;padding: 4px 13px;background: #e1e2e3;display: inline-block;border-radius: 4px;margin-right:10px;cursor: pointer;user-select: none;box-shadow: 1px 2px 3px #b7bbbd;',
        onClick: this.click
      },
      this.props.label
    )
  }
  click = () => {
    this.props.onCommand(this.props.command)
  }
}
class Wrappe extends Component {
  render (h) {
    return h('div',
      { style: 'border:solid 1px #eee;' },
      [
        h(this.props.ToolBar),
        h(this.props.Body)
      ]
    )
  }
}
class Body extends Component {
  render (h) {
    return h('div', { style: "padding:16px;min-height: 200px;" },
      [
        h(Block),
        h(Paragraph)
      ]
    )
  }
}


export default class UI {
  editor = null
  constructor(editor) {
    this.editor = editor
  }
  render () {
    render(
      h(Wrappe, {
        ToolBar: h(ToolBar, {
          tools: [
            { label: '加粗', command: 'bold' },
            { label: '倾斜', command: 'italic' }
          ],
          onCommand: (command) => console.log(command)
        }),
        Body
      }),
      document.getElementById(this.editor.host))
  }
}
