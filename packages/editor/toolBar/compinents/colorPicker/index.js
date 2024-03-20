import Palette from './palette'
import ControlPanel from './controlPanel'
import { createRef, Component } from '@typex/core'
const colors = [
  ["#FFFFFF", // 白色
    "#CCCCCC", // 非常浅的灰色
    "#999999", // 浅灰色
    "#666666", // 中灰色
    "#333333", // 深灰色
    "#000000", // 黑色
    "#FF0000", // 红色
    "#FF4500", // 橙红色
    "#FFA500", // 橙色
    "#FFFF00", // 黄色
  ],
  [
    "#00FF00", // 青绿色
    "#00FFFF", // 青色
    "#0000FF", // 蓝色
    "#FF00FF", // 品红
    "#800080", // 紫色
    "#8A2BE2", // 紫罗兰色
    "#FF1493", // 深粉色
    "#FF69B4", // 粉红
    "#FFC0CB", // 粉红
    "#FFD700", // 金色
  ]
];
const isSelected = true
export default class ColorPicker extends Component {
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
            {row.map(ele =>
              <div style={`position: relative;${isSelected ? 'width: 16px; height: 16px' : 'width: 18px; height: 18px'}; margin: 1px;`}>
                <div style={`background:${ele}; width: 100%; height: 100%; border-radius: 20%;`}></div>
                {isSelected && <div style={`position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; border: 1px solid orange; border-radius: 20%; pointer-events: none;`}></div>}
              </div>
            )}
          </div>)}
        </div>
        <div class="divider divider-height-1 divider-dashed divider-color-gray"></div>
        <div class="picker-block" style='font-size:0;'>
          <Palette ref={this.paletteRef} controlPanel={this.controlPanelRef}></Palette>
          <ControlPanel ref={this.controlPanelRef} color={this.props.color} paletteRef={this.paletteRef}></ControlPanel>
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
