import { Component } from '../core/model/index'

export class Paragraph extends Component {
  render(h) {
    const { age, child, ChildParagraph } = this.props
    return h(
      'p',
      {
        style: 'color:#666;background:#eee',
        onClick: () => {
          console.log(this)
          this.ChildParagraph.byparent()
        },
      },
      [`这是一个11段落${age}`, h(child, { onRef: this.onRef }), h(ChildParagraph, { onRef: this.onRef }), h('div', { style: 'color:blue' }, this.props.children), h('text', 'h(text)')]
    )
  }
  onRef = (ref) => {
    this.ChildParagraph = ref
  }
}
export class ChildParagraph extends Component {
  render(h) {
    return h('span', { style: 'color:red;background:#eee', onClick: this.onclick }, 'ChildParagraph')
  }
  onclick() {
    console.log('点击了ChildParagraph')
  }
  byparent() {
    console.log('Paragraph 触发了ChildParagraph的方法')
  }
}
