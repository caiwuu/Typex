import { Component } from '../core/model/index'

export class Paragraph extends Component {
  render(h) {
    const { age, child } = this.props
    console.log(child)
    return h(
      'p',
      {
        style: 'color:#666;background:#eee',
        onClick: () => {
          child.byparent()
        },
      },
      [`这是一个段落${age}`, h(child)]
    )
  }
}
export class ChildParagraph extends Component {
  render(h) {
    return h('span', { style: 'color:red;background:#eee', onClick: this.onclick }, 'child')
  }
  onclick() {
    console.log('点击了ChildParagraph')
  }
  byparent() {
    console.log('Paragraph 触发了ChildParagraph的方法')
  }
}
