import { createRef, Component, utils } from '@typex/core'
import { rgbToCoordinates, coordinatesToRgb } from './utils'
const { throttle, isDef } = utils
function pauseEvent (e) {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}

export default class Palette extends Component {
  constructor(props) {
    super(props)
    this.state = { hue: 0, x: 228, y: 0, px: 1, py: 1 }
    this.containerRef = createRef()
  }
  render () {
    return (
      <div
        style={`background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), linear-gradient(to left, hsla(${this.state.hue}, 100%, 50%, 1), rgba(255, 255, 255, 1))`}
        onMousedown={this.handleMouseDown}
        class='palette'
        ref={this.containerRef}
      >
        <span style={`top:${this.state.y}px;left:${this.state.x}px;`} class='cursor'></span>
      </div>
    )
  }
  handleChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
    const left = x - (this.containerRef.current.getBoundingClientRect().left + window.scrollX)
    const top = y - (this.containerRef.current.getBoundingClientRect().top + window.scrollY)
    const px = (228 - left) / 228
    const py = (150 - top) / 150
    console.log(left, top);
    this.setState({
      x: left >= 228 ? 228 : left <= 0 ? 0 : left,
      y: top >= 150 ? 150 : top <= 0 ? 0 : top,
      px,
      py,
    })
    const [R, G, B] = coordinatesToRgb(this.state.hue, px, py)
    this.props.controlPanel.current.update({ R, G, B })
  }, 32)

  handleMouseDown = (e) => {
    pauseEvent(e)
    this.handleChange(e)
    window.addEventListener('mousemove', this.handleChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = (e) => {
    pauseEvent(e)
    this.unbindEventListeners()
  }

  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
  setPalette (H, R, G, B) {
    if (isDef(B)) {
      const [x, y] = rgbToCoordinates(H, R, G, B)
      this.setState({ x: (1 - x) * 228, y: (1 - y) * 150, px: x, py: y })
    }
    this.setState({ hue: H })
  }
}
