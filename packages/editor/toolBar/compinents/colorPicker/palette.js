import { createRef, Component, utils } from '@typex/core'
import { rgbToCoordinates, coordinatesToRgb, RGBToHSL } from './utils'
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
    this.state = { H: 0, x: 228, y: 0, px: 0, py: 1 }
    this.containerRef = createRef()
  }
  render () {
    return (
      <div
        style={`background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), linear-gradient(to left, hsla(${this.state.H}, 100%, 50%, 1), rgba(255, 255, 255, 1))`}
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
    let left = x - (this.containerRef.current.getBoundingClientRect().left + window.scrollX)
    let top = y - (this.containerRef.current.getBoundingClientRect().top + window.scrollY)
    left = left < 0 ? 0 : left > 228 ? 228 : left
    top = top < 0 ? 0 : top > 150 ? 150 : top
    const px = (228 - left) / 228
    const py = (150 - top) / 150
    const [R, G, B] = coordinatesToRgb(this.state.H, px, py)
    this.setState({ x: left, y: top, px, py })
    this.props.controlPanel.current.update(this.state.H, R, G, B)
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
  update (H, R, G, B) {
    const [px, py] = rgbToCoordinates(H, R, G, B)
    const x = (1 - px) * 228
    const y = (1 - py) * 150
    this.setState({ x, y, px, py, H })
  }
}
