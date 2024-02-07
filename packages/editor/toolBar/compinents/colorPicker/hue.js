/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:09:26
 */
import { createRef, Component, utils } from '@typex/core'
import { toRGBArray, HSLToRGB, RGBToHSL, coordinatesToRgb } from './utils'
const { throttle, isDef } = utils
function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}
export default class Hue extends Component {
  constructor(props) {
    super(props)
    this.color = this.props.color
    this.state = { x: 200, x2: 200, R: 255, G: 0, B: 0, A: 1 }
    this.colorBlock = createRef()
    this.hueContainer = createRef()
    this.transparencyContainer = createRef()
  }
  render() {
    return (
      <div class='picker'>
        <div class='left'>
          <div ref={this.hueContainer} onMousedown={this.handleHueMouseDown} class='hue'>
            <div style={`left:${this.state.x}px`} class='hue-picker'></div>
          </div>
          <div
            onMousedown={this.handleTransparencyMouseDown}
            class='transparency'
            style='margin-top:4px'
          >
            <div
              class='transparency-picker-bg'
              style={`background: linear-gradient(to right, rgba(${this.state.R},${this.state.G},${this.state.B},0) 0%, rgba(${this.state.R},${this.state.G},${this.state.B},1)`}
            ></div>
            <div ref={this.transparencyContainer} style='position:absolute;top:0'>
              <div style={`left:${this.state.x2}px;`} class='transparency-picker'></div>
            </div>
          </div>
        </div>
        <div class='right'>
          <div class='color-block-bg'></div>
          <div style={`background:${this.color};`} ref={this.colorBlock} class='color-block'></div>
        </div>
      </div>
    )
  }
  onMounted() {
    let [R, G, B, A] = toRGBArray(getComputedStyle(this.colorBlock.current).backgroundColor)
    const [hue] = RGBToHSL(R, G, B)
    A = isDef(A) ? A : 1
    this.props.paletteRef.current.setPalette(hue, R, G, B)
    const x = 200 - (hue * 5) / 9
    this.setState({
      A,
      x2: A * 200 <= 6 ? 6 : A * 200,
      x: x <= 6 ? 6 : x,
      R,
      G,
      B,
    })
  }
  // hue
  handleHueChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.hueContainer.current.getBoundingClientRect().left + window.pageXOffset)
    left = left >= 200 ? 200 : left <= 0 ? 0 : left
    const hue = (1 - left / 200) * 360
    const [R, G, B] = coordinatesToRgb(
      hue,
      this.props.paletteRef.current.state.px,
      this.props.paletteRef.current.state.py
    )
    this.color = `rgba(${R},${G},${B},${this.state.A})`
    this.setState({ x: left <= 6 ? 6 : left, R, G, B })
    this.props.paletteRef.current.setPalette(hue)
  }, 32)
  handleHueMouseDown = (e) => {
    pauseEvent(e)
    this.handleHueChange(e)
    window.addEventListener('mousemove', this.handleHueChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  // Transparency
  handleTransparencyChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left =
      x - (this.transparencyContainer.current.getBoundingClientRect().left + window.pageXOffset)
    left = left >= 200 ? 200 : left <= 0 ? 0 : left
    const A = left / 200
    this.color = `rgba(${this.state.R},${this.state.G},${this.state.B},${A})`
    this.setState({ x2: left <= 6 ? 6 : left, A })
  }, 32)

  handleTransparencyMouseDown = (e) => {
    pauseEvent(e)
    this.handleTransparencyChange(e)
    window.addEventListener('mousemove', this.handleTransparencyChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }
  // pub
  handleMouseUp = (e) => {
    pauseEvent(e)
    this.unbindEventListeners()
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleHueChange)
    window.removeEventListener('mousemove', this.handleTransparencyChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
}
