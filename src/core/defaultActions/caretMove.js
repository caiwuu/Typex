/*
 * @Author: caiwu
 * @Description: 光标移动功能
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:58
 */

/**
 * 水平移动
 * @param {*} range
 * @param {*} direction
 * @param {*} shiftKey
 * @returns
 */
export function horizontalMove (direction, range, event) {
  // 拼音输入法聚合输入的时候禁止光标的移动
  if (range.inputState.isComposing) return
  if (!range.collapsed && !event.shiftKey) {
    range.collapse(direction === 'left')
    return
  }
  const { shiftKey } = event
  if (!range.collapsed && !shiftKey) {
    range.collapse(direction === 'left')
  } else {
    return range.container.component.caretMove(direction, range, event)
  }
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
  const initialCaretInfo = { ...range.caret.rect, blockComponent: range.container.blockComponent }
  const prevCaretInfo = { ...range.caret.rect, blockComponent: range.container.blockComponent }
  loop(range, d, initialCaretInfo, prevCaretInfo, false, event)
}
/**
 * 光标跨行判断
 * @param {*} initialCaretInfo
 * @param {*} prevCaretInfo
 * @param {*} currCaretInfo
 * @param {*} editor
 * @returns
 */
function isSameLine (initialCaretInfo, prevCaretInfo, currCaretInfo) {
  // 标识光标是否在同一行移动
  let sameLine = true
  // 判断自动折行(非结构层面的换行,如一行文字太长被浏览器自动换行的情况)
  // 这种情况第一行必定会占满整个屏幕宽度，只需要判断前后光标位置是否为一个屏幕宽度减去一个字符宽度即可
  // 这里通过判断前后两个光标位置距离是否大于一定的值来判断
  if (
    Math.abs(currCaretInfo.x - prevCaretInfo.x) >
    currCaretInfo.blockComponent.props.path.elm.offsetWidth - 2 * currCaretInfo.h
  ) {
    sameLine = false
  }
  // console.log(currCaretInfo.blockComponent.props.path.elm.offsetWidth)
  // 当前光标位置和前一个位置所属块不一致则肯定发生跨行
  if (currCaretInfo.blockComponent !== prevCaretInfo.blockComponent) {
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
 * @returns
 */
function loop (range, direction, initialCaretInfo, prevCaretInfo, lineChanged = false, event) {
  if (range.collapsed) {
    range.d = 0
  }
  const { path } = horizontalMove(direction, range, event) || {}
  if (!path) return
  range.updateCaret(true)
  if (lineChanged) {
    const currCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
    const preDistance = Math.abs(prevCaretInfo.x - initialCaretInfo.x)
    const currDistance = Math.abs(currCaretInfo.x - initialCaretInfo.x)
    // 标识前后光标是否在同一行
    const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo)
    if (!(currDistance <= preDistance && sameLine)) {
      const d = direction === 'left' ? 'right' : 'left'
      horizontalMove(d, range, event)
      range.updateCaret(true)
      return
    }
  }
  const currCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
  if (currCaretInfo.x === prevCaretInfo.x && currCaretInfo.y === prevCaretInfo.y) return
  const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo)
  if (!sameLine) {
    lineChanged = true
  }
  return loop(range, direction, initialCaretInfo, currCaretInfo, lineChanged, event)
}
