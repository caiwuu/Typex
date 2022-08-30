/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-30 13:26:37
 */
const actionMap = {
  left: 'arrowLeft',
  right: 'arrowRight',
  up: 'arrowUp',
  down: 'arrowDown',
}
export default function caretMove({ direction, drawCaret, shiftKey }) {
  switch (direction) {
    case 'left':
    case 'right':
      this.selection.ranges.forEach((range) => {
        if (range.inputState.isComposing) return
        if (!range.collapsed && !shiftKey) {
          range.collapse(direction === 'left')
        } else {
          const { container, offset } = range
          // 非文本
          if (container.nodeType !== 3) {
            const path = this.queryPath(container.childNodes[(offset || 1) - 1])
            path.component.caretMove(actionMap[direction], path, range, shiftKey)
          } else {
            // 文本
            let path = this.queryPath(container)
            const component = path.component
            component.caretMove(actionMap[direction], path, range, shiftKey)
          }
          // setTimeout(() => {
          // this.selection.drawRangeBg(11)
          // }, 0)
        }
      })
      break

    default:
      console.log(direction, drawCaret, shiftKey)
      break
  }
  Promise.resolve().then(() => {
    this.selection.ranges.forEach((range) => {
      range.updateCaret(drawCaret)
    })
    this.selection.drawRangeBg(11)
  })
}