import { Component, createRef } from '../core/model/index'

export class Paragraph extends Component {
  constructor(props) {
    super(props)
    this.comIns = createRef()
    this.domIns = createRef()
  }
  render (h) {
    return h(
      'p',
      {
        // style: 'color:#666;background:#eee;padding:10px;margin:16px',
        ref: this.domIns,
      },
      '一个段落...'
    )
  }
  componentDidMount () {
    // console.log(this.dom)
  }
}
