import { Component, createRef } from '../core/model/index'

export class Content extends Component {
  constructor(props) {
    super(props)
    this.comIns = createRef()
    this.domIns = createRef()
  }
  render(h) {
    return h(this.props.children)
  }
  componentDidMount() {
    console.log(this)
  }
}
