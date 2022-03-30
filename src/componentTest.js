import { createElement as h, mount, Component, createRef } from './core'

class Palette extends Component {
  constructor(props) {
    super(props)
    this.state = { hue: 0, x: 0, y: 0 }
  }
  render() {
    return (
      <div
        style={`background: linear-gradient(to top, rgba(0, 0, 0, 1), transparent), linear-gradient(to left, hsla(${this.state.hue}, 100%, 50%, 1), rgba(255, 255, 255, 1))`}
        onClick={this.handerClick}
        class='palette'
      >
        <span style={`top:${this.state.y}px;left:${this.state.x}px;`} class='palette-picker'></span>
      </div>
    )
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
    this.state = { y: 0 }
  }
  render() {
    return (
      <div onClick={this.handerClick} class='hue'>
        <span style={`top:${this.state.y}px`} class='hue-picker'></span>
      </div>
    )
  }
  handerClick = (e) => {
    const { offsetY: y } = e
    const hue = (y * 360) / 200
    this.setState({ y: y })
    this.props.paletteRef.current.setHue(hue)
  }
}
class ColorPick extends Component {
  constructor(props) {
    super(props)
    this.paletteRef = createRef()
  }
  render() {
    return (
      <div>
        <Palette ref={this.paletteRef}></Palette>
        <Hue paletteRef={this.paletteRef}></Hue>
      </div>
    )
  }
}
mount(h(ColorPick), document.getElementById('components-test'))
