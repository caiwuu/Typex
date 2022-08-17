import KeyboardIntercept from './keyboardIntercept'
import MouseIntercept from './mouseIntercept'
export default function initIntercept(editor) {
  const keyboardIntercept = new KeyboardIntercept(editor)
  const mouseProxy = new MouseIntercept(editor)
  editor.on('focus', () => keyboardIntercept.focus())
  return function destroy() {
    keyboardIntercept.destroy()
    mouseProxy.destroy()
  }
}
