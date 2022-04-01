import { Component } from '../../core'
import { throttle } from '../../core/share/utils'
export default class Palette extends Component {
  constructor(props) {
    super(props)
    this.state = { hue: 0, x: 228, y: 0 }
  }
  render() {
    return (
      <div
        style={`background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), linear-gradient(to left, hsla(${this.state.hue}, 100%, 50%, 1), rgba(255, 255, 255, 1))`}
        onClick={this.handerClick}
        onMousedown={this.handleMouseDown}
        class='palette'
      >
        <span style={`top:${this.state.y}px;left:${this.state.x}px;`} class='palette-picker'></span>
      </div>
    )
  }
  handleChange = throttle((e) => {
    const { offsetX: x, offsetY: y } = e
    this.setState({ x, y })
  }, 30)

  handleMouseDown = (e) => {
    this.handleChange(e)
    window.addEventListener('mousemove', this.handleChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }
  setHue(hue) {
    this.setState({ hue: hue })
  }
  handerClick = (e) => {
    const { offsetX: x, offsetY: y } = e
    this.setState({ x, y })
  }
}
