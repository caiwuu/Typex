import Palette from './palette'
import Hue from './hue'
import { createRef, Component } from '@typex/core'
const colorList = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FFC0CB",
  "#FFA500",
  "#00FFFF",
  "#800080",
  "#FF6347",
  "#8A2BE2",
  "#7FFF00",
  "#8B008B",
  "#A52A2A",
  "#4169E1",
  "#228B22",
  "#FF4500"
]
export default class ColorPicker extends Component {
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
    this.hueRef = createRef()
  }
  render () {
    return (
      <div style="background:#fff">
        <div style="display:flex;width:228px;flex-wrap: wrap;justify-content:space-between;padding:10px;box-sizing:border-box">
          {colorList.map(ele => <div style={`background:${ele};height:16px;width:50px;margin:4px 0;border-radius:4px`}></div>)}
        </div>
        <div style='font-size:0;width:228px;'>
          <Palette ref={this.paletteRef} hue={this.hueRef}></Palette>
          <Hue ref={this.hueRef} color={this.props.color} paletteRef={this.paletteRef}></Hue>
        </div>
      </div>
    )
  }
  onMounted () {
    console.log('ColorPicker')
  }
  onCreated () {
    console.log('-==-');
  }
}
