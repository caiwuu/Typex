/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-23 13:57:44
 */
import { times } from '../utils'
import del from './del'
export default function input({ data, type, clear }) {
  if (!this.collapsed) {
    del.call(this)
  }
  if (type === 'input') {
    let prevInputValue,
      inputData = data === ' ' ? '\u00A0' : data || ''
    // 键盘字符输入
    if (!this.inputState.isComposing && data) {
      console.log('键盘输入：', inputData)
      prevInputValue = this.inputState.value
    } else {
      console.log('聚合输入:', inputData)
      prevInputValue = this.inputState.value
      this.inputState.value = inputData
    }
    times(prevInputValue.length, del, this, true)
    inputData !== '' && this.editor.emit('insert', { range: this, data: inputData })
  } else if (type === 'compositionstart') {
    // console.log('开始聚合输入:', data)
    this.inputState.isComposing = true
  } else if (type === 'compositionend') {
    // console.log('结束聚合输入:', data)
    // TODO 接收聚合输入
    this.inputState.isComposing = false
    clear()
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      this.inputState.value = ''
    })
  }
}
