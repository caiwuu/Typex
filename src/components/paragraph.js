import { Component, createRef } from '../core/model/index'

export class Paragraph extends Component {
  constructor(props) {
    super(props)
    this.comIns = createRef()
    this.domIns = createRef()
  }
  render (h) {
    const { age, child, ChildParagraph } = this.props
    return h(
      'p',
      {
        style: 'color:#666;background:#eee',
        onClick: () => {
          console.log(this)
          this.ChildParagraph.byparent()
        },
        ref: this.domIns
      },
      [`这是一个11段落${age}`, h(child), h(ChildParagraph, { onRef: this.onRef, ref: this.comIns }), h('div', { style: 'color:blue' }, this.props.children), h('text', 'h(text)')]
    )
  }
  onRef = (ref) => {
    this.ChildParagraph = this.comIns.current
  }
  componentDidMount () {
    console.log(this.dom);
  }
}
export class ChildParagraph extends Component {
  render (h) {
    return h('span', { style: 'color:red;background:#eee', onClick: this.onclick }, 'ChildParagraph')
  }
  onclick () {
    console.log('点击了ChildParagraph')
  }
  byparent () {
    console.log('Paragraph 触发了ChildParagraph的方法')
  }
  componentDidMount () {
    this.props.onRef && this.props.onRef(this)
  }
  isMounted () { }
}
