import { Component, createRef } from '@/core'

const comMap = {
    fontColor:(h,self)=>(
        <div id="colorPicker">
            <div id="colorDisplay"></div>
            <input type="color" id="colorInput"/>
            <label for="alphaInput">Alpha:</label>
            <input type="range" id="alphaInput" min="0" max="1" step="0.01" value="1"/>
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


