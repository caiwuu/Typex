import { EventProxy, Selection, registerActions } from '../core'
import emit from 'mitt'
import UI from './ui'
export default class Editor {
  tools = []
  constructor() {
    this.ui = new UI(this)
    this.emitter = emit()
    this.selection = new Selection(this)
  }
  mount(id) {
    this.host = id
    this.ui.render()
    new EventProxy(this)
    registerActions(this)
  }
  setTools(tools) {
    this.tools = [...tools]
  }
  execComand(command, ...args) {
    this.emit(command, ...args)
  }
  on(eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  emit(eventName, ...args) {
    this.emitter.emit(eventName, args)
  }
  focus() {
    this.emitter.emit('focus')
  }
}
