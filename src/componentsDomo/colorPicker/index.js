import Palette from './palette'
import Hue from './hue'
import { Component, createRef } from '../../core'
import rgbToCoordinates from './utils'
export default class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
  }
  render() {
    return (
      <div style='font-size:0;width:228px;'>
        <Palette ref={this.paletteRef}></Palette>
        <Hue paletteRef={this.paletteRef}></Hue>
      </div>
    )
  }
}
rgbToCoordinates(128, 74, 74)
