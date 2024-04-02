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
    this.state = { x: 200, x2: 200, R: 255, G: 0, B: 0, A: 1 }
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
    console.log('onMountedonMounted');
    this.$nextTick(() => {
      let [R, G, B, A] = toRGBArray(getComputedStyle(this.colorBlock.current).backgroundColor)
      const [hue] = RGBToHSL(R, G, B)
      A = isDef(A) ? A : 1
      // this.props.paletteRef.current.setPalette(hue, R, G, B)
      const x = 200 - (hue * 5) / 9
      this.setState({
        x: x <= 6 ? 6 : x,
        x2: A * 200 <= 6 ? 6 : A * 200,
        R,
        G,
        B,
        A,
      })
    })
  }

  update = (state) => {
    const { R, G, B, A } = state
    this.color = `rgba(${R},${G},${B},${A || this.state.A})`
    const [hue] = RGBToHSL(R, G, B)
    const x = 200 - (hue * 5) / 9
    // this.props.paletteRef.current.setPalette(hue, R, G, B)
    this.setState({
      A,
      x2: A * 200 <= 6 ? 6 : A * 200,
      x: x <= 6 ? 6 : x,
      R,
      G,
      B,
    })
    this.props.onChange?.({ R, G, B, A: A || this.state.A })
  }

  /**
   * @description 色块颜色更新
   * @memberof ControlPanel
   * @private
   */
  updateColorBlockStyle = (R, G, B, A) => {
    this.colorBlockStyle = `background:rgba(${R},${G},${B},${A});`
  }
  /**
  * @description 色相滑块块滑动事件
  * @memberof ControlPanel
  * @private
  */
  handleHueChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.hueContainer.current.getBoundingClientRect().left + window.scrollX)
    left = left >= 200 ? 200 : left <= 6 ? 6 : left
    const hue = (1 - (left - 6) / 194) * 360
    const [R, G, B] = coordinatesToRgb(
      hue,
      this.props.paletteRef.current.state.px,
      this.props.paletteRef.current.state.py
    )
    this.updateColorBlockStyle(R, G, B, this.state.A)
    console.log(R, G, B, this.state.A);
    this.setState({ x: left, R, G, B })
    // this.props.paletteRef.current.setPalette(hue)
  }, 32)

  /**
   * @description 透明度滑块块滑动事件
   * @memberof ControlPanel
   * @private
   */
  handleTransparencyChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    let left = x - (this.transparencyContainer.current.getBoundingClientRect().left + window.scrollX)
    left = left >= 200 ? 200 : left <= 0 ? 0 : left
    const A = left / 200
    const { R, G, B } = this.state
    this.update({ x2: left <= 6 ? 6 : left, A, R, G, B })
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
