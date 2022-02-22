import UI from './ui'
export default class Editor {
  tools = []
  constructor() {
    this.ui = new UI(this)
  }
  mount(id) {
    this.host = id
    this.ui.render()
  }
  setTools(tools) {
    this.tools = [...tools]
  }
  execComand(command) {
    console.log(command)
  }
}
