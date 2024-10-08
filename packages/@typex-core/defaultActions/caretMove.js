/*
 * @Author: caiwu
 * @Description: 光标移动功能
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:58
 */

/**
 * @description 水平移动
 * @export
 * @param {*} direction
 * @param {*} range
 * @param {*} event
 * @returns {*}
 */
export function horizontalMove (direction, range, event) {
  // 拼音输入法聚合输入的时候禁止光标的移动
  if (range.inputState.isComposing) return
  if (!range.collapsed && !event.shiftKey) {
    range.collapse(direction === 'left')
    return
  }
  console.log(11111111111);

  // const { shiftKey } = event
  // if (!range.collapsed && !shiftKey) {
  //   range.collapse(direction === 'left')
  // } else {
  return range.container.currentComponent.onCaretMove(direction, range, event)
  // }
}
/**
 * 垂直移动 垂直移动等效于水平移动N步的结果，关键点在于确定N
 * 这里通过光标位置回溯法，计算出最合适的N
 * @param {*} range
 * @param {*} direction
 * @param {*} shiftKey
 */
export function verticalMove (direction, range, event) {
  if (range.inputState.isComposing) return
  if (!range.collapsed && !event.shiftKey) {
    range.collapse(direction === 'up')
    return
  }
  const d = direction === 'up' ? 'left' : 'right'
  const initialCaretInfo = { ...range.caret.rect, block: range.container.block }
  const prevCaretInfo = { ...range.caret.rect, block: range.container.block }
  loop(range, d, initialCaretInfo, prevCaretInfo, false, event)
}
/**
 * 光标跨行判断
 * @param {*} initialCaretInfo
 * @param {*} prevCaretInfo
 * @param {*} currCaretInfo
 * @param {*} editor
 * @returns {Boolean}
 */
function isSameLine (initialCaretInfo, prevCaretInfo, currCaretInfo, direction) {
  // 当前光标位置和前一个位置所属块不一致则肯定发生跨行
  if (currCaretInfo.block !== prevCaretInfo.block) {
    return false
  }
  // 标识光标是否在同一行移动
  let sameLine = true
  // 判断自动折行(非结构层面的换行,如一行文字太长被浏览器自动换行的情况)
  if (
    (direction === 'left' && currCaretInfo.x > prevCaretInfo.x) ||
    (direction === 'right' && currCaretInfo.x < prevCaretInfo.x)
  ) {
    sameLine = false
  }
  //光标Y坐标和参考点相同说明光标还在本行，最理想的情况放在最后判断
  if (currCaretInfo.y === initialCaretInfo.y) {
    sameLine = true
  }
  return sameLine
}

/**
 * 循环执行函数
 * @param {*} range
 * @param {*} direction
 * @param {*} initialCaretInfo
 * @param {*} prevCaretInfo
 * @param {*} lineChanged
 * @param {*} shiftKey
 * @returns {*}
 */

function loop (range, direction, initialCaretInfo, prevCaretInfo, lineChanged = false, event) {
  if (range.collapsed) {
    range.d = 0
  }
  const { path } = horizontalMove(direction, range, event) || {}
  if (!path) return
  range.updateCaret(true)
  const currCaretInfo = { ...range.caret.rect, block: path.block }
  const currDistance = Math.abs(currCaretInfo.x - initialCaretInfo.x)
  if (currDistance === 0) return
  if (lineChanged) {
    const preDistance = Math.abs(prevCaretInfo.x - initialCaretInfo.x)
    // 标识前后光标是否在同一行
    const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, direction)
    if (!(currDistance <= preDistance && sameLine)) {
      const d = direction === 'left' ? 'right' : 'left'
      horizontalMove(d, range, event)
      range.updateCaret(true)
      return
    }
  }
  if (currCaretInfo.x === prevCaretInfo.x && currCaretInfo.y === prevCaretInfo.y) return
  const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, direction)
  if (!sameLine) {
    lineChanged = true
  }
  return loop(range, direction, initialCaretInfo, currCaretInfo, lineChanged, event)
}
