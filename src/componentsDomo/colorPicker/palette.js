import { Component, createRef } from '../../core'
import { throttle } from '../../core/share/utils'
function pauseEvent(e) {
  if (e.stopPropagation) e.stopPropagation()
  if (e.preventDefault) e.preventDefault()
  e.cancelBubble = true
  e.returnValue = false
  return false
}
export default class Palette extends Component {
  constructor(props) {
    super(props)
    this.state = { hue: 0, x: 228, y: 0 }
    this.containerRef = createRef()
  }
  render() {
    return (
      <div
        style={`background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), linear-gradient(to left, hsla(${this.state.hue}, 100%, 50%, 1), rgba(255, 255, 255, 1))`}
        onClick={this.handerClick}
        onMousedown={this.handleMouseDown}
        class='palette'
        ref={this.containerRef}
      >
        <span style={`top:${this.state.y}px;left:${this.state.x}px;`} class='palette-picker'></span>
      </div>
    )
  }
  handleChange = throttle((e) => {
    pauseEvent(e)
    const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
    const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
    const left = x - (this.containerRef.current.getBoundingClientRect().left + window.pageXOffset)
    const top = y - (this.containerRef.current.getBoundingClientRect().top + window.pageYOffset)
    this.setState({
      x: left >= 228 ? 228 : left <= 0 ? 0 : left,
      y: top >= 150 ? 150 : top <= 0 ? 0 : top,
    })
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
  setPalette(hue) {
    this.setState({ hue: hue })
  }
  handerClick = (e) => {
    const { offsetX: x, offsetY: y } = e
    this.setState({ x, y })
  }
}
