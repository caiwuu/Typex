import pluginContext from './pluginContext'
import emit from 'mitt'
import Selection from './selection'
import { usePlugin } from './pluginContext'
import Formater from '@/core/model/formater'
import History from './history/index'
import Transaction from './transform/transaction'
import { del } from './defaultActions/delete'
import { times } from './utils'
const inputState = {
  value: '',
  isComposing: false,
}
/**
 * @description 内核初始化
 * @export
 * @param {*} ops
 */
export default function initCore({ editor, formats, plugins }) {
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

/**
 * @description 事件拦截到对应的组件
 * @param {*} editor
 */
function initDispatcher(editor) {
  let ts = null
  let insertTextStep

  // 鼠标事件处理
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

  // 键盘事件处理
  editor.on('keyboardEvents', (event) => {
    // 输入处理
    if (isInput(event)) {
      if (event.data === null) return
      if (!ts || ts.commited) ts = new Transaction(editor)
      input(event, ({ data, prevDataLength, type }) => {
        editor.selection.ranges.forEach((range) => {
          if (!range.collapsed) del(range, true)
          if (prevDataLength) times(prevDataLength, del, editor, range, true)
          const path = range.container

          if (type === 'input' || type === 'compositioning') {
            insertTextStep = path.component.onInsert({ type: 'text', data, range, ts })
          }

          if (type === 'input' || type === 'compositionend') {
            ts.addStep(insertTextStep)

            const onInputHandle = path.component.onInput
            if (typeof onInputHandle === 'function') {
              onInputHandle.call(path.component, event, range, ts)
            }
          }
        })
        ts.commit()
      })
    } else {
      // 其他键盘事件处理
      const quickEventKey = event.key ? `${event.type}${event.key}` : null
      const nornaleventKey = `${event.type}`
      editor.selection.ranges.forEach((range) => {
        const path = range.container
        const quickEventHandle = quickEventKey
          ? path.component[`on${titleCase(quickEventKey)}`]
          : null // 支持简写handle
        const nornaleventHandle = path.component[`on${titleCase(nornaleventKey)}`]

        if (typeof quickEventHandle === 'function') {
          quickEventHandle.call(path.component, event, range)
        }

        if (typeof nornaleventHandle === 'function') {
          nornaleventHandle.call(path.component, event, range)
        }
      })
      // 与选取状态无关的操作 如撤销重做
      editor.emit(quickEventKey, event)
      editor.emit(nornaleventKey, event)
    }
  })
  // 选区事件处理
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

  editor.on('keydownz', (event) => {
    if (event.ctrlKey) {
      editor.history.undo()
    }
  })
  editor.on('keydownZ', (event) => {
    if (event.ctrlKey) {
      editor.history.redo()
    }
  })
}

function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
function isInput(event) {
  return event.type.startsWith('composition') || event.type === 'input'
}
function input(e, callback) {
  const { data, type } = e
  if (type === 'input') {
    let inputData = data === ' ' ? '\u00A0' : data || ''
    // 键盘字符输入
    if (!inputState.isComposing && data) {
      callback({
        data: inputData,
        type: 'input',
      })
    } else {
      const prevDataLength = inputState.value.length
      inputState.value = inputData
      callback({
        data: inputData,
        type: 'compositioning',
        prevDataLength,
      })
    }
  } else if (type === 'compositionstart') {
    inputState.value = ''
    inputState.isComposing = true
  } else if (type === 'compositionend') {
    /**
     * 这里定时器的作用：
     * 1.解决在chrome中 回车和失焦两个事件，compositionend和input事件的触发先后不一样
     * 2.改变执行顺序（失焦input事件是微任务，需要在它之后执行） 消除失焦意外插入的bug（腾讯文档和google文档都存在此bug）
     */
    setTimeout(() => {
      callback({
        data: inputState.value,
        type: 'compositionend',
      })
      inputState.value = ''
      inputState.isComposing = false
    })
    e.target.value = ''
  }
}
