import { times } from '../share/utils'
import del from './del'
export default function input (event) {
  if (!this.collapsed) {
    // this.del()
    console.warn('TODO DEL')
    return
  }
  if (event.type === 'input') {
    let prevInputValue,
      inputData = event.data === ' ' ? '\u00A0' : event.data + '' || ''
    // 键盘字符输入
    if (!this.inputState.isComposing && event.data) {
      console.log('键盘输入：', event.data)
      prevInputValue = this.inputState.value
    } else {
      console.log('聚合输入:', event.data)
      prevInputValue = this.inputState.value
      this.inputState.value = inputData
    }
    console.warn('TODO 实现del')
    times(prevInputValue.length, del, this, true)
    this.editor.emit('insert', { node: this.endVNode, pos: this.endOffset, R: this }, inputData)
  } else if (event.type === 'compositionstart') {
    console.log('开始聚合输入:', event.data)
    this.inputState.isComposing = true
  } else if (event.type === 'compositionend') {
    console.log('结束聚合输入:', event.data)
    // TODO 接收聚合输入
    this.inputState.isComposing = false
    event.target.value = ''
    // 改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
    setTimeout(() => {
      this.inputState.value = ''
    })
  }
}
