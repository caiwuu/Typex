import plugins from './plugins'
export default function initCore(editor) {
  initDispatcher(editor)
}
function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
function initDispatcher(editor) {
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
        ? path.component[`on${titleCase(event.type)}${titleCase(event.key)}`]
        : null
      let eventHandle
      // 处理聚合输入
      if (event.type.startsWith('composition')) {
        eventHandle = path.component.onInput
      } else {
        eventHandle = path.component[`on${titleCase(event.type)}`]
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
