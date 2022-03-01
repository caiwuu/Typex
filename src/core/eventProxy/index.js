import KeyboardProxy from './keyboard'
import MouseProxy from './mouse'
export class EventProxy {
  constructor(editor) {
    // this.emitter = emit()
    this.keyboardProxy = new KeyboardProxy(editor)
    this.mouseProxy = new MouseProxy(editor)
    editor.on('focus', () => this.keyboardProxy.focus())
  }
  removeAll() {
    this.keyboardProxy.destroy()
    this.mouseProxy.destroy()
  }
}
