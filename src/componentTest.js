import { createElement as h, mount, Component, createRef } from './core'
import { throttle, HSLToRGB } from './core/share/utils'
class Palette extends Component {
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
class Hue extends Component {
  constructor(props) {
    super(props)
    this.state = { x: 0, x2: 0 }
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
          <div class='color-block'></div>
        </div>
      </div>
    )
  }
  // hue
  handleHueChange = throttle((e) => {
    const { offsetX: x } = e
    const hue = (x * 360) / 200
    const [R, G, B] = HSLToRGB(hue, 100, 50)
    console.log(R, G, B)
    this.setState({ x: x })
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
    this.setState({ x2: x2 })
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
class ColorPick extends Component {
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
  }
  render() {
    return (
      <div style='font-size:0;width:228px;'>
        <Palette ref={this.paletteRef}></Palette>
        <Hue paletteRef={this.paletteRef}></Hue>
      </div>
    )
  }
}
mount(h(ColorPick), document.getElementById('components-test'))
