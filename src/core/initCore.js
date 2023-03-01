import plugins from './plugins'
export default function initCore (editor) {
  initDispatcher(editor)
}
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
      const eventKeyHandle = path.component[`on${event.key}`]
      const keyDownHandle = path.component.onKeydown
      if (typeof eventKeyHandle === 'function') {
        eventKeyHandle(range, event)
      }
      if (typeof keyDownHandle === 'function') {
        keyDownHandle(range, event)
      }
    })
    Promise.resolve().then(() => {
      editor.selection.updateCaret()
    })
  })
}
