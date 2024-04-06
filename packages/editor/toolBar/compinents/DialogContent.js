import { Component } from '@typex/core'
import ColorPicker from './colorPicker'

const comMap = {
  fontColor: (h, self) => (
    <div id="colorPicker">
      <ColorPicker onOk={self.props.onOk} color='#666666'></ColorPicker>
    </div>
  )
}
export class DialogContent extends Component {
  constructor(props) {
    super(props)
  }
  render (h) {
    return comMap[this.props.name]?.(h, this) || <span>404</span>
  }
}


