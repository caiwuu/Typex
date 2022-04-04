import { Component, createRef } from '../../core'
import { throttle } from '../../core/share/utils'
import { toRGBArray, HSLToRGB } from './utils'
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
    this.state = { x: 200, x2: 200, R: 255, bg: this.props.color, A: 1 }
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
              style={`background: linear-gradient(to right, #FF000000 0%, #FF0000FF`}
            ></div>
            <div ref={this.transparencyContainer} style='position:absolute;top:0'>
              <div style={`left:${this.state.x2}px;`} class='transparency-picker'></div>
            </div>
          </div>
        </div>
        <div class='right'>
          <div class='color-block-bg'></div>
          <div
            style={`background:${this.state.bg};`}
            ref={this.colorBlock}
            class='color-block'
          ></div>
        </div>
      </div>
    )
  }
  onMounted() {
    console.log('hue', toRGBArray(getComputedStyle(this.colorBlock.current).backgroundColor))
    const [R, G, B, A] = toRGBArray(getComputedStyle(this.colorBlock.current).backgroundColor)
    // const A = getComputedStyle(this.colorBlock.current).opacity / 1
    console.log(A)
    this.setState({ bg: this.props.color, A, x2: A * 200 })
  }
  // hue
  handleHueChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.hueContainer.current.getBoundingClientRect().left + window.pageXOffset)
    left = left >= 200 ? 200 : left <= 0 ? 0 : left
    const hue = (left * 360) / 200
    const [R, G, B] = HSLToRGB(hue, 100, 50)
    this.setState({ x: left <= 6 ? 6 : left, bg: `rgba(${R},${G},${B},${this.state.A};)` })
    this.props.paletteRef.current.setPalette(hue)
  }, 30)

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
    this.setState({ x2: left <= 6 ? 6 : left, A: left / 200 })
  }, 30)

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
