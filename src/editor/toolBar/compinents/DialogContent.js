import { Component, createRef } from '@/core'
import ColorPicker from './colorPicker'

const comMap = {
    fontColor:(h,self)=>(
        <div id="colorPicker">
            <ColorPicker color='#666600'></ColorPicker>
      </div>
    )
}
export class DialogContent extends Component {
    constructor(props) {
      super(props)
    }
    render(h) {
      return comMap[this.props.name]?.(h,this)
    }
  }


