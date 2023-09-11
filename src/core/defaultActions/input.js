/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 12:19:39
 */
import { del } from './delete'
import { isPrimitive, times } from '../utils'

/**
 * @description 文本输入
 * @param {*} range
 * @param {*} data
 */
function inputText(range, data, ts) {
  let { startContainer: path } = range
  if (path) {
    if (path.vn.type !== 'text') {
      path = path.firstLeaf
      range.setEnd(path, 0)
    }
    const component = path.parent.component
    return component.contentInput(path, range, data, ts)
  } else {
    console.error('无效path')
  }
}

/**
 * @description 操作转换
 * @param {*} e
 * @returns {*}
 */
function transformOps(e) {
  if (isPrimitive(e)) {
    return {
      type: 'input',
      data: e,
    }
  }
  return e
}

/**
 * @description 输入操作
 * @export
 * @param {*} range
 * @param {*} e
 */
let insertTextStep = null
export function input(range, e, ts) {
  const { data, type } = transformOps(e)
  if (!range.collapsed) del(range, true)
  if (type === 'input') {
    console.log(type, '00000000000000000')
    let prevInputValue,
      inputData = data === ' ' ? '\u00A0' : data || ''
    // 键盘字符输入
    if (!range.inputState.isComposing && data) {
      console.log('键盘输入：================================>', inputData)
      prevInputValue = range.inputState.value
      times(prevInputValue.length, del, range.editor, range, true)
      ts.addStep(inputText(range, inputData))
    } else {
      console.log('聚合输入: -------------------------------->', inputData)
      prevInputValue = range.inputState.value
      range.inputState.value = inputData
      times(prevInputValue.length, del, range.editor, range, true)
      console.log(range.offset, prevInputValue.length)
      insertTextStep = inputText(range, inputData)
    }
  } else if (type === 'compositionstart') {
    console.log(type, '00000000000000000')
    // console.log('开始聚合输入:', data)
    range.inputState.isComposing = true
  } else if (type === 'compositionend') {
    /**
     * 这里定时器的作用：
     * 1.解决在chrome中 回车和失焦两个事件，compositionend和input事件的触发先后不一样
     * 2.改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
     */
    setTimeout(() => {
      console.log(type, '00000000000000000')
      range.inputState.isComposing = false
      range.inputState.value = ''
      console.log(insertTextStep)
      insertTextStep && ts.addStep(insertTextStep)
      insertTextStep = null
      ts.commit()
    })
    // console.log('结束聚合输入:', data)
    e.target.value = ''
  }
}
