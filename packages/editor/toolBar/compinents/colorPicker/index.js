import Palette from './palette'
import ControlPanel from './controlPanel'
import { createRef, Component } from '@typex/core'
import { rgbaToHex, hexToRgba } from './utils'

const colors = [
  [
    "#ffffff", // 白色
    "#cccccc", // 非常浅的灰色
    "#999999", // 浅灰色
    "#666666", // 中灰色
    "#333333", // 深灰色
    "#000000", // 黑色
    "#ff0000", // 红色
    "#ff4500", // 橙红色
    "#ffa500", // 橙色
    "#ffff00", // 黄色
  ],
  [
    "#00ff00", // 青绿色
    "#00ffff", // 青色
    "#0000ff", // 蓝色
    "#ff00ff", // 品红
    "#800080", // 紫色
    "#8a2be2", // 紫罗兰色
    "#ff1493", // 深粉色
    "#ff69b4", // 粉红
    "#ffc0cb", // 粉红
    "#ffd700", // 金色
  ]
];
export default class ColorPicker extends Component {
  state = {
    hexColor: ''
  }
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
    this.controlPanelRef = createRef()
  }

  render () {
    return (
      <div class="color-picker-block">
        <div class="colors-block">
          {colors.map(row => <div style="display:flex;flex-wrap: wrap;justify-content:space-between;box-sizing:border-box;margin:4px 0">
            {row.map(ele => {
              const isSelected = this.isSelected(ele)
              return <div onClick={() => this.colorsClick(ele)} style={`position: relative;${isSelected ? 'width: 16px; height: 16px;padding:1px' : 'width: 18px; height: 18px'}; margin: 1px;`}>
                <div style={`background:${ele}; width: 100%; height: 100%; border-radius: 20%;`}></div>
                {isSelected ? <div style={`position: absolute; inset: -2px; border: 1px solid orange; border-radius: 20%; pointer-events: none;`}></div> : ''}
              </div>
            }
            )}
          </div>)}
        </div>
        <div class="divider divider-height-1 divider-dashed divider-color-gray"></div>
        <div class="picker-block" style='font-size:0;'>
          <Palette ref={this.paletteRef} controlPanel={this.controlPanelRef} ></Palette>
          <ControlPanel onChange={this.onChange} ref={this.controlPanelRef} color={this.props.color} paletteRef={this.paletteRef}></ControlPanel>
        </div>
      </div>
    )
  }

  colorsClick = (ele) => {
    this.setState({
      hexColor: ele
    })
    const [R, G, B, A] = hexToRgba(ele)
    this.controlPanelRef.current.update({ R, G, B, A })
  }

  isSelected = (hc) => {
    return this.state.hexColor === hc
  }

  onChange = ({ R, G, B, A }) => {
    this.setState({
      hexColor: rgbaToHex([R, G, B])
    })
    console.log(rgbaToHex([R, G, B]));
  }

  onMounted () {
    console.log('ColorPicker')
  }

  onCreated () {
    console.log('-==-');
  }
}
