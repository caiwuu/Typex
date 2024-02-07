/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 14:49:48
 */
import KeyboardIntercept from './keyboardIntercept'
import MouseIntercept from './mouseIntercept'
export default function initIntercept(editor) {
  const keyboardIntercept = new KeyboardIntercept(editor)
  const mouseProxy = new MouseIntercept(editor)
  editor.on('focus', (range) => keyboardIntercept.focus(range))
  editor.on('destroy', () => {
    keyboardIntercept.destroy()
    mouseProxy.destroy()
  })
}
