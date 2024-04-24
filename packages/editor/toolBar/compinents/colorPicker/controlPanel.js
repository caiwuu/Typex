/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 11:09:26
 */
import { createRef, Component, utils } from '@typex/core'
import { toRGBArray, RGBToHSL, coordinatesToRgb } from './utils'
const { throttle, isDef } = utils
function pauseEvent (e) {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}
export default class ControlPanel extends Component {
  constructor(props) {
    super(props)
    this.colorBlockStyle = `background:${this.props.color};`
    this.state = { x: 200, x2: 200, H: 0, R: 255, G: 0, B: 0, A: 1 }
    this.colorBlock = createRef()
    this.hueContainer = createRef()
    this.transparencyContainer = createRef()
  }

  render () {
    return (
      <div class='control-panel'>
        <div class='left'>
          <div ref={this.hueContainer} onMousedown={this.handleHueMouseDown} class='hue-slider slider-bar'>
            <div style={`left:${this.state.x}px`} class='cursor'></div>
          </div>
          <div
            onMousedown={this.handleTransparencyMouseDown}
            class='transparency-slider slider-bar'
            style='margin-top:4px'
          >
            <div
              class='transparency-gradient'
              ref={this.transparencyContainer}
              style={`background: linear-gradient(to right, rgba(${this.state.R},${this.state.G},${this.state.B},0) 0%, rgba(${this.state.R},${this.state.G},${this.state.B},1)`}
            >
              <div style={`left:${this.state.x2}px;`} class='cursor'></div>
            </div>
          </div>
        </div>
        <div class='right'>
          <div class='color-block-bg'></div>
          <div style={this.colorBlockStyle} ref={this.colorBlock} class='color-block'></div>
        </div>
      </div>
    )
  }

  onMounted () {
    this.$nextTick(() => {
      let [R, G, B, A] = toRGBArray(getComputedStyle(this.colorBlock.current).backgroundColor)
      const [H] = RGBToHSL(R, G, B)
      this.update(H, R, G, B, A)
      this.props.paletteRef.current.update(H, R, G, B)
    })
  }

  /**
   * @description 更新
   * @param {*} H
   * @param {*} R
   * @param {*} G
   * @param {*} B
   * @param {*} A
   * @memberof ControlPanel
   */
  update = (H, R, G, B, A) => {
    A = isDef(A) ? A : this.state.A
    this.updateColorBlockStyle(R, G, B, A)
    const x = 194 - (H * 5) / 9
    this.setState({
      x: x,
      x2: A * 194,
      H,
      R,
      G,
      B,
      A,
    })
  }

  /**
   * @description 色块颜色更新
   * @memberof ControlPanel
   */
  updateColorBlockStyle = (R, G, B, A) => {
    this.colorBlockStyle = `background:rgba(${R},${G},${B},${A});`
    this.props.onChange(R, G, B, A)
  }
  /**
  * @description 色相滑块块滑动事件
  * @memberof ControlPanel
  */
  handleHueChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.hueContainer.current.getBoundingClientRect().left + window.scrollX)
    left = left >= 194 ? 194 : left <= 0 ? 0 : left
    const H = (1 - left / 194) * 360
    const [R, G, B] = coordinatesToRgb(
      H,
      this.props.paletteRef.current.state.px,
      this.props.paletteRef.current.state.py
    )
    const A = this.state.A
    this.update(H, R, G, B, A)
    this.props.paletteRef.current.update(H, R, G, B, A)
  }, 32)

  /**
   * @description 透明度滑块块滑动事件
   * @memberof ControlPanel
   */
  handleTransparencyChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.transparencyContainer.current.getBoundingClientRect().left + window.scrollX)
    left = left >= 200 ? 200 : left <= 0 ? 0 : left
    const A = left / 200
    const { R, G, B, H } = this.state
    this.update(H, R, G, B, A)
  }, 32)

  handleHueMouseDown = (e) => {
    pauseEvent(e)
    this.handleHueChange(e)
    window.addEventListener('mousemove', this.handleHueChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }


  handleTransparencyMouseDown = (e) => {
    pauseEvent(e)
    this.handleTransparencyChange(e)
    window.addEventListener('mousemove', this.handleTransparencyChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = (e) => {
    pauseEvent(e)
    this.unbindEventListeners()
  }

  unbindEventListeners () {
    window.removeEventListener('mousemove', this.handleHueChange)
    window.removeEventListener('mousemove', this.handleTransparencyChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
}
