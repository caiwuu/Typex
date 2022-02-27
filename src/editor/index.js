import { EventProxy, Selection } from '../core'
import emit from 'mitt'
import UI from './ui'
export default class Editor {
  tools = []
  constructor() {
    this.ui = new UI(this)
    this.emitter = emit()
    this.selection = new Selection(this)
  }
  mount (id) {
    this.host = id
    this.ui.render()
    new EventProxy(this)
  }
  setTools (tools) {
    this.tools = [...tools]
  }
  execComand (command) {
    console.log(command)
  }
  on (eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  focus () {
    this.emitter.emit('focus')
  }
}
