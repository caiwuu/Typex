/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 17:10:45
 */
function times(n, fn, context = undefined, ...args) {
  let i = 0
  while (i++ < n) {
    fn.call(context, ...args)
  }
}

export default function input(range, { data, type, clear }) {
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
    times(prevInputValue.length, range.editor.emit, range.editor, 'delete', {
      range,
      force: true,
    })
    inputData !== '' && range.editor.emit('insert', { range, data: inputData })
  } else if (type === 'compositionstart') {
    // console.log('开始聚合输入:', data)
    range.inputState.isComposing = true
  } else if (type === 'compositionend') {
    // console.log('结束聚合输入:', data)
    // TODO 接收聚合输入
    range.inputState.isComposing = false
    clear()
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      range.inputState.value = ''
    })
  }
}
