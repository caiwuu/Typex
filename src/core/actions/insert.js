/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 12:19:39
 */
import { del } from './delete'
import { isPrimitive, times } from '../utils'
// 执行输入型插入
function input(range, data) {
  let { startContainer: path } = range
  if (path) {
    if (path.vn.type !== 'text') {
      path = path.firstLeaf
      range.setEnd(path, 0)
    }
    const component = path.parent.component
    component.contentInput(path, range, data)
  } else {
    console.error('无效path')
  }
}

function transformOps(ops) {
  if (isPrimitive(ops)) {
    return {
      type: 'input',
      data: ops,
    }
  }
  return ops
}
// 插入类型处理
function insert(range, ops) {
  const { data, type, clearCb } = transformOps(ops)
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
    // inputData !== '' && input(range, inputData)
    input(range, inputData)
  } else if (type === 'compositionstart') {
    // console.log('开始聚合输入:', data)
    range.inputState.isComposing = true
  } else if (type === 'compositionend') {
    // console.log('结束聚合输入:', data)
    range.inputState.isComposing = false
    clearCb && clearCb()
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      range.inputState.value = ''
    })
  }
}

export default function (ops) {
  this.selection.ranges.forEach((range) => {
    insert(range, ops)
  })
}
