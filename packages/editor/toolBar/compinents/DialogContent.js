import { Component, createRef } from '@typex/core'
import ColorPicker from './colorPicker'

const comMap = {
  fontColor: (h, self) => (
    <div id="colorPicker">
      <ColorPicker color='red'></ColorPicker>
    </div>
  )
}
export class DialogContent extends Component {
  constructor(props) {
    super(props)
  }
  render (h) {
    return comMap[this.props.options.componentName]?.(h, this) || <span>404</span>
  }
}


