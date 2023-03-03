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
function inputText (range, data) {
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

function transformOps (e) {
  if (isPrimitive(e)) {
    return {
      type: 'input',
      data: e,
    }
  }
  return e
}
// 插入类型处理
export function input (range, e) {
  const { data, type } = transformOps(e)
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
    console.log(prevInputValue.length)
    times(prevInputValue.length, del, range.editor, range, true)
    inputText(range, inputData)
  } else if (type === 'compositionstart') {
    // console.log('开始聚合输入:', data)
    range.inputState.isComposing = true
  } else if (type === 'compositionend') {
    // console.log('结束聚合输入:', data)
    range.inputState.isComposing = false
    e.target.value = ''
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      range.inputState.value = ''
    })
  }
}
