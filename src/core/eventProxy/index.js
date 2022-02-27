// import emit from 'mitt'
import KeyboardProxy from './keyboard'
import MouseProxy from './mouse'
export class EventProxy {
  constructor(editor) {
    // this.emitter = emit()
    this.keyboardProxy = new KeyboardProxy(editor)
    this.mouseProxy = new MouseProxy(editor)
    editor.on('focus', () => this.keyboardProxy.focus())
  }
  // on (eventName, fn) {
  //   this.emitter.on(eventName, fn)
  // }
  // remove (eventName, fn) {
  //   this.emitter.off(eventName, fn)
  // }
  removeAll () {
    this.keyboardProxy.destroy()
    this.mouseProxy.destroy()
    // this.emitter.all.clear()
  }
}
