import caretMove from './caret'
import { nativeSelection } from '../native'
export default function registerActions(editor) {
  editor.on('caretMove', (args) => {
    const [direction, drawCaret, shiftKey] = args
    // 支持多光标但是目前还不支持多选区；这里禁止多光标拖蓝
    if (shiftKey && editor.selection.ranges.length > 1) {
      return
    }
    const nativeRange = nativeSelection.rangeCount > 0 ? nativeSelection.getRangeAt(0) : null
    editor.selection.ranges.forEach((range) => {
      // 没按shift 并且 存在选区,取消选区，左右不移动光标，上下可移动光标
      if (!shiftKey && !range.collapsed) {
        const collapseToStart = direction === 'left'
        nativeRange && nativeRange.collapse(collapseToStart)
        range.collapse(collapseToStart)
        range._d = 0
        range.updateCaret()
        if (direction === 'up' || direction === 'down') {
          caretMove[direction].call(range, shiftKey)
          drawCaret && range.updateCaret()
        }
      } else {
        if (range.collapsed) {
          range._d = 0
        }
        caretMove[direction].call(range, shiftKey)
        drawCaret && range.updateCaret()
      }
    })
    editor.selection.distinct()
    editor.focus()
    // 按住shit时同步到真实原生range绘制拖蓝
    if (shiftKey) {
      editor.selection.drawRangeBg()
    }
  })
}
