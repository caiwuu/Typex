import plugins from './plugins'
import emit from 'mitt'
import Selection from './selection'
import { usePlugin } from '.'


/**
 * @description 内核初始化
 * @export
 * @param {*} ops
 */
export default function initCore (ops) {
  const { editor, formater, platform } = ops
  editor.$eventBus = emit()
  formater.inject('editor', editor)
  const initIntercept = usePlugin(platform)
  editor.selection = new Selection(editor)
  Promise.resolve().then(() => {
    initIntercept(editor)
  })
  initDispatcher(editor)
}
function titleCase (str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * @description 事件拦截到对应的组件
 * @param {*} editor
 */
function initDispatcher (editor) {
  editor.on('mouseEvents', (event) => {
    if (!event.shiftKey && event.button === 0) {
      const count = plugins.platform.nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = plugins.platform.nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      editor.selection.updateRanges(event.altKey)
    }
  })
  editor.on('keyboardEvents', (event) => {
    editor.selection.ranges.forEach((range) => {
      const path = range.container
      // 支持简写handle
      const quickEventHandle = event.key
        ? path.component[`on${titleCase(event.type)}${titleCase(event.key)}`]?.bind(path.component)
        : null
      let eventHandle
      // 处理聚合输入
      if (event.type.startsWith('composition')) {
        eventHandle = path.component.onInput?.bind(path.component)
      } else {
        eventHandle = path.component[`on${titleCase(event.type)}`]?.bind(path.component)
      }
      if (event.key && typeof quickEventHandle === 'function') {
        quickEventHandle(range, event)
      }
      if (typeof eventHandle === 'function') {
        eventHandle(range, event)
      }
    })
    Promise.resolve().then(() => {
      editor.selection.updateCaret()
    })
  })
}
