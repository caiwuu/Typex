import pluginContext from './pluginContext'
import emit from 'mitt'
import Selection from './selection'
import { usePlugin } from './pluginContext'
import Formater from '@/core/model/formater'
import History from './history/index'
import Transaction from './transform/transaction'
import { del } from './defaultActions/delete'
import { isPrimitive, times } from './utils'

/**
 * @description 内核初始化
 * @export
 * @param {*} ops
 */
export default function initCore ({ editor, formats, plugins }) {
  const fmtIns = new Formater()
  fmtIns.register(formats)
  editor.$eventBus = emit()
  fmtIns.inject('editor', editor)
  editor.formater = fmtIns
  editor.history = new History({
    editor,
  })
  usePlugin(plugins)
  editor.selection = new Selection(editor)
  Promise.resolve().then(() => {
    pluginContext.platform.initIntercept(editor)
  })
  initDispatcher(editor)
}
function titleCase (str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
function isInput (event) {
  return event.type.startsWith('composition') || event.type === 'input'
}
/**
 * @description 文本输入
 * @param {*} range
 * @param {*} data
 */
function inputText (range, data, ts) {
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
function transformOps (e) {
  if (isPrimitive(e)) {
    return {
      type: 'input',
      data: e,
    }
  }
  return e
}
const inputState = {
  value: '',
  isComposing: false
}
export function input (e, callback) {
  const { data, type } = e
  if (type === 'input') {
    let inputData = data === ' ' ? '\u00A0' : data || ''
    // 键盘字符输入
    if (!inputState.isComposing && data) {
      console.log('----------', inputData);
      callback({
        data: inputData,
        type: 'input'
      })
    } else {
      const prevDataLength = inputState.value.length
      inputState.value = inputData
      callback({
        data: inputData,
        type: "compositioning",
        prevDataLength
      })
    }
  } else if (type === 'compositionstart') {
    inputState.value = ""
    inputState.isComposing = true
  } else if (type === 'compositionend') {
    /**
     * 这里定时器的作用：
     * 1.解决在chrome中 回车和失焦两个事件，compositionend和input事件的触发先后不一样
     * 2.改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
     */
    setTimeout(() => {
      console.log('----------', inputState.value);
      callback({
        data: inputState.value,
        type: "compositionend",
      })
      inputState.value = ""
      inputState.isComposing = false
    })
    e.target.value = ''
  }
}
/**
 * @description 事件拦截到对应的组件
 * @param {*} editor
 */
function initDispatcher (editor) {
  let ts = null
  let insertTextStep
  editor.on('mouseEvents', (event) => {
    if (!event.shiftKey && event.button === 0) {
      const count = pluginContext.platform.nativeSelection.rangeCount
      for (let i = 0; i < count; i++) {
        const nativeRange = pluginContext.platform.nativeSelection.getRangeAt(i)
        nativeRange.collapse(true)
      }
      editor.selection.updateRangesFromNative(event.altKey)
    }
  })
  editor.on('keyboardEvents', (event) => {
    // 输入处理
    if (isInput(event)) {
      if (event.data === null) return
      if (!ts || ts.commited) ts = new Transaction(editor)
      input(event, ({ data, prevDataLength, type }) => {
        console.log(prevDataLength);
        editor.selection.ranges.forEach((range) => {
          if (!range.collapsed) del(range, true)
          if (prevDataLength) times(prevDataLength, del, editor, range, true)
          const path = range.container
          if (type === 'input' || type === 'compositioning') {
            insertTextStep = path.component.insert({ type: 'text', data, range })
          }
          if (type === 'input' || type === 'compositionend') {
            ts.addStep(insertTextStep)
          }
          console.log(data, ts, prevDataLength);
          const eventHandle = path.component.onInput?.bind(path.component)
          if (typeof eventHandle === 'function' && (type === 'input' || type === 'compositionend')) {
            // eventHandle(event, range)
          }
        })
        ts.commit()
      })
    } else {
      // 其他键盘事件处理
      editor.selection.ranges.forEach((range) => {
        const path = range.container
        // 支持简写handle
        const quickEventHandle = event.key
          ? path.component[`on${titleCase(event.type)}${event.key}`]?.bind(path.component)
          : null
        const eventHandle = path.component[`on${titleCase(event.type)}`]?.bind(path.component)
        if (typeof eventHandle === 'function') {
          eventHandle(event, range)
        }
        if (typeof quickEventHandle === 'function') {
          quickEventHandle(event, range)
        }
      })
    }
  })
  editor.on('selectionchange-origin', () => {
    const nativeSelection = pluginContext.platform.nativeSelection
    const { startContainer, startOffset, endContainer, endOffset } =
      editor.selection.ranges[0] || {}
    editor.emit('selectionchange', {
      startContainer,
      startOffset,
      endContainer,
      endOffset,
    })
    if (nativeSelection && !nativeSelection.isCollapsed) {
      editor.selection.ranges.forEach((range) => {
        range.caret.hidden()
      })
    }
  })
}
