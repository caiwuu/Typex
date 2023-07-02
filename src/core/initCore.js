import pluginContext from './pluginContext'
import emit from 'mitt'
import Selection from './selection'
import { usePlugin } from './pluginContext'
import Formater from '@/core/model/formater'
import History from './history/index'

/**
 * @description 内核初始化
 * @export
 * @param {*} ops
 */
export default function initCore(ops) {
  const { editor, formats, plugins } = ops
  const fmtIns = new Formater()
  fmtIns.register(formats)
  editor.$eventBus = emit()
  fmtIns.inject('editor', editor)
  editor.formater = fmtIns
  editor.history = new History(20, editor)
  usePlugin(plugins)
  editor.selection = new Selection(editor)
  Promise.resolve().then(() => {
    pluginContext.platform.initIntercept(editor)
  })
  initDispatcher(editor)
}
function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * @description 事件拦截到对应的组件
 * @param {*} editor
 */
function initDispatcher(editor) {
  editor.on('mouseEvents', (event) => {
    if (!event.shiftKey && event.button === 0) {
      const count = pluginContext.platform.nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = pluginContext.platform.nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      editor.selection.updateRangesFromNative(event.altKey)
    }
  })
  editor.on('keyboardEvents', (event) => {
    editor.selection.ranges.forEach((range) => {
      const path = range.container
      // 支持简写handle
      const quickEventHandle = event.key
        ? path.component[`on${titleCase(event.type)}${event.key}`]?.bind(path.component)
        : null
      let eventHandle
      // 处理聚合输入
      if (event.type.startsWith('composition')) {
        eventHandle = path.component.onInput?.bind(path.component)
      } else {
        eventHandle = path.component[`on${titleCase(event.type)}`]?.bind(path.component)
      }
      if (typeof eventHandle === 'function') {
        eventHandle(range, event)
      }
      if (event.key && typeof quickEventHandle === 'function') {
        quickEventHandle(range, event)
      }
    })
  })
  editor.on('selectionchange-origin', () => {
    const nativeSelection = pluginContext.platform.nativeSelection
    const { startContainer, startOffset, endContainer, endOffset } =
      editor.selection.ranges[0] || {}
    editor.emit('selectionchange', {
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    })
    if (nativeSelection && !nativeSelection.isCollapsed) {
      editor.selection.ranges.forEach((range) => {
        range.caret.hidden()
      })
    }
  })
}
