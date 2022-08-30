/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-30 15:28:31
 */
import { getVnOrElm, getVnOrPath } from '../mappings'
import { del } from './delete'

function times(n, fn, context = undefined, ...args) {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}
// 文本插入
function insertText(range, data) {
  const { startOffset: pos, startContainer: elm } = range
  let path = getVnOrPath(getVnOrElm(elm))
  if (path) {
    if (path.node.type !== 'text') {
      path = path.firstLeaf
    }
    const component = path.parent.component
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.update(this, path).then(() => {
      range.setStart(path, range.startOffset + data.length)
      range.collapse(true)
      range.updateCaret()
    })
  } else {
    console.error('无效path')
  }
}
function preInsert(range, { data, type, clear }) {
  if (!range.collapsed) {
    range.editor.emit('delete', { range, force: false })
  }
  if (type === 'input') {
    let prevInputValue,
      inputData = data === ' ' ? '\u00A0' : data || ''
    // 键盘字符输入
    if (!range.inputState.isComposing && data) {
      console.log('键盘输入：', inputData)
      prevInputValue = range.inputState.value
    } else {
      console.log('聚合输入:', inputData)
      prevInputValue = range.inputState.value
      range.inputState.value = inputData
    }
    times(prevInputValue.length, del, range.editor, range, true)
    inputData !== '' && insertText(range, inputData)
  } else if (type === 'compositionstart') {
    // console.log('开始聚合输入:', data)
    range.inputState.isComposing = true
  } else if (type === 'compositionend') {
    // console.log('结束聚合输入:', data)
    // TODO 接收聚合输入
    range.inputState.isComposing = false
    clear && clear()
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      range.inputState.value = ''
    })
  }
}

export default function (ops) {
  this.selection.ranges.forEach((range) => {
    preInsert(range, ops)
  })
}
