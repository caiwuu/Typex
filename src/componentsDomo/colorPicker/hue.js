import { Component, createRef } from '../../core'
import { throttle, HSLToRGB } from '../../core/share/utils'
export default class Hue extends Component {
  constructor(props) {
    super(props)
    this.state = { x: 200, x2: 200, R: 255, G: 0, B: 0, A: 1 }
    this.colorBlock = createRef()
  }
  render() {
    return (
      <div class='picker'>
        <div class='left'>
          <div onMousedown={this.handleHueMouseDown} class='hue'>
            <span style={`left:${this.state.x}px`} class='hue-picker'></span>
          </div>
          <div
            onMousedown={this.handleTransparencyMouseDown}
            class='transparency'
            style='margin-top:4px'
          >
            <div
              class='transparency-picker-bg'
              style={`background: linear-gradient(to right, #FF000000 0%, #FF0000FF`}
            ></div>
            <div style='position:absolute;top:0'>
              <span style={`left:${this.state.x2}px;`} class='transparency-picker'></span>
            </div>
          </div>
        </div>
        <div class='right'>
          <div class='color-block-bg'></div>
          <div
            style={`background:rgba(${this.state.R},${this.state.G},${this.state.B},${this.state.A})`}
            ref={this.colorBlock}
            class='color-block'
          ></div>
        </div>
      </div>
    )
  }
  onMounted() {
    console.log('hue')
    console.log(getComputedStyle(this.colorBlock.current).backgroundColor)
  }
  // hue
  handleHueChange = throttle((e) => {
    const { offsetX: x } = e
    const hue = (x * 360) / 200
    const [R, G, B] = HSLToRGB(hue, 100, 50)
    // console.log(R, G, B)
    this.setState({ x: x, R, G, B })
    this.props.paletteRef.current.setHue(hue)
  }, 30)

  handleHueMouseDown = (e) => {
    this.handleHueChange(e)
    window.addEventListener('mousemove', this.handleHueChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  // Transparency
  handleTransparencyChange = throttle((e) => {
    const { offsetX: x2 } = e
    this.setState({ x2: x2, A: x2 / 200 })
  }, 30)

  handleTransparencyMouseDown = (e) => {
    this.handleTransparencyChange(e)
    window.addEventListener('mousemove', this.handleTransparencyChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }
  // pub
  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleHueChange)
    window.removeEventListener('mousemove', this.handleTransparencyChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
}
