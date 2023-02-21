/*
 * @Author: caiwu
 * @Description: 光标移动功能
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 13:57:58
 */

/**
 * 路径查找
 * @param {*} ele
 * @param {*} offset
 * @param {*} editor
 * @returns
 */
function queryPath(ele, offset = 0, editor) {
  const path = editor.queryPath(ele)
  if (path) return path
  if (ele.nodeType !== 3) return editor.queryPath(ele.childNodes[(offset || 1) - 1])
}

/**
 * 水平移动
 * @param {*} range
 * @param {*} direction
 * @param {*} shiftKey
 * @returns
 */
function horizontalMove(range, direction, shiftKey) {
  // 拼音输入法聚合输入的时候禁止光标的移动
  if (range.inputState.isComposing) return
  if (!range.collapsed && !shiftKey) {
    range.collapse(direction === 'left')
  } else {
    const path = queryPath(range.container, range.offset, this)
    return path.component.caretMove(direction, path, range, shiftKey)
  }
}

/**
 * 光标跨行判断
 * @param {*} initialCaretInfo
 * @param {*} prevCaretInfo
 * @param {*} currCaretInfo
 * @param {*} editor
 * @returns
 */
function isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, editor) {
  // 标识光标是否在同一行移动
  let sameLine = true
  // 判断自动折行(非结构层面的换行,如一行文字太长被浏览器自动换行的情况)
  // 这种情况第一行必定会占满整个屏幕宽度，只需要判断前后光标位置是否为一个屏幕宽度减去一个字符宽度即可
  // 这里通过判断前后两个光标位置距离是否大于一定的值来判断
  if (
    Math.abs(currCaretInfo.x - prevCaretInfo.x) >
    // editor.ui.content.offsetWidth - 2 * currCaretInfo.h
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
function loop(range, direction, initialCaretInfo, prevCaretInfo, lineChanged = false, shiftKey) {
  // debugger
  if (range.collapsed) {
    range.d = 0
  }
  const { path } = horizontalMove.call(this, range, direction, shiftKey) || {}
  if (!path) return
  range.updateCaret(true)
  if (lineChanged) {
    const currCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
    const preDistance = Math.abs(prevCaretInfo.x - initialCaretInfo.x)
    const currDistance = Math.abs(currCaretInfo.x - initialCaretInfo.x)
    // 标识前后光标是否在同一行
    const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, this)
    if (!(currDistance <= preDistance && sameLine)) {
      const d = direction === 'left' ? 'right' : 'left'
      horizontalMove.call(this, range, d, shiftKey)
      range.updateCaret(true)
      return
    }
  }
  const currCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
  if (currCaretInfo.x === prevCaretInfo.x && currCaretInfo.y === prevCaretInfo.y) return
  const sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, this)
  if (!sameLine) {
    lineChanged = true
  }
  return loop.call(this, range, direction, initialCaretInfo, currCaretInfo, lineChanged, shiftKey)
}

/**
 * 垂直移动 垂直移动等效于水平移动N步的结果，关键点在于确定N
 * 这里通过光标位置回溯法，计算出最合适的N
 * @param {*} range
 * @param {*} direction
 * @param {*} shiftKey
 */
function verticalMove(range, direction, shiftKey) {
  const path = queryPath(range.container, range.offset, this)
  const initialCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
  const prevCaretInfo = { ...range.caret.rect, blockComponent: path.blockComponent }
  const d = direction === 'up' ? 'left' : 'right'
  loop.call(this, range, d, initialCaretInfo, prevCaretInfo, false, shiftKey)
}

/**
 * 光标移动
 * @param {*} param
 */
export default function caretMove({ direction, drawCaret, shiftKey }) {
  switch (direction) {
    case 'left':
    case 'right':
      this.selection.ranges.forEach((range) => {
        horizontalMove.call(this, range, direction, shiftKey)
      })
      break

    case 'up':
    case 'down':
      this.selection.ranges.forEach((range) => {
        verticalMove.call(this, range, direction, shiftKey)
      })

      break
  }
  // 在事件循环末尾绘制更新光标UI
  Promise.resolve().then(() => {
    this.selection.updateCaret(drawCaret)
  })
}
