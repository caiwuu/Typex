import pluginContext from './pluginContext'
import emit from 'mitt'
import Selection from './selection'
import { initPlugin } from './pluginContext'
import Formater from './model/formater'
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
export default function initCore ({ editor, formats, plugins }) {
  initFormater(editor, formats)
  initHistory(editor)
  initPlugin(plugins)
  initSelection(editor)
  initIntercept(editor)
  initDispatcher(editor)
}

/**
 * @description 初始事件拦截器
 * @param {*} editor
 * @private
 */

function initIntercept (editor) {
  Promise.resolve().then(() => {
    pluginContext.platform.initIntercept(editor)
  })
}
/**
 * @description 初始化选区
 * @param {*} editor
 * @private
 */

function initSelection (editor) {
  editor.selection = new Selection(editor)
}

/**
 * @description 初始化历史记录
 * @param {*} editor
 * @private
 */

function initHistory (editor) {
  editor.history = new History({
    editor,
  })
}

/**
 * @description 初始化格式管理器
 * @param {*} editor
 * @private
 */
function initFormater (editor, formats) {
  const fmtIns = new Formater()
  fmtIns.register(formats)
  editor.$eventBus = emit()
  fmtIns.inject('editor', editor)
  editor.formater = fmtIns
}
/**
 * @description 事件拦截到对应的组件
 * @param {*} editor
 * @private
 */
function initDispatcher (editor) {
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
    // 创建事务
    if (!ts) ts = new Transaction(editor)
    // 复用未提交的事务 
    else if (!ts.commited) ts.init()
    if (isInput(event)) {
      console.log(event.type, event.key);
      // 输入处理
      if (event.data === null) return
      input(event, ({ data, prevDataLength, type }) => {
        editor.selection.ranges.forEach((range) => {
          if (!range.collapsed) del({ event, range, ts, force: true })
          if (prevDataLength) times(prevDataLength, del, editor, { event, range, ts, force: true })
          const path = range.container

          if (type === 'input' || type === 'compositioning') {
            insertTextStep = path.currentComponent.onInsert({ type: 'text', data, range, ts, event })
            ts.addStep(insertTextStep)
          }

          if (type === 'input' || type === 'compositionend') {
            if (!event.data) times(1, del, editor, { event, range, ts, force: true })
          }
        })
      })
    } else {
      // 其他键盘事件处理
      if (inputState.isComposing || event.key === "Process") return // 阻止在中文输入的时候触发其他键盘事件
      console.log(event.type, event.key);
      const quickEventKey = event.key ? `${event.type}${event.key}` : null
      const nornaleventKey = `${event.type}`
      editor.selection.ranges.forEach((range) => {
        const path = range.container
        const quickEventHandle = quickEventKey ? path.currentComponent[`on${titleCase(quickEventKey)}`] : null // 支持简写handle
        const nornaleventHandle = path.currentComponent[`on${titleCase(nornaleventKey)}`]
        if (typeof quickEventHandle === 'function') {
          quickEventHandle.call(path.currentComponent, { event, range, ts })
        }

        if (typeof nornaleventHandle === 'function') {
          nornaleventHandle.call(path.currentComponent, { event, range, ts })
        }
      })
      editor.emit(quickEventKey, event)
      editor.emit(nornaleventKey, event)
    }
    ts = ts.commit()
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


  // 与选取状态无关的操作 如撤销重做
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

function titleCase (str) {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
function isInput (event) {
  return event.type.startsWith('composition') || event.type === 'input'
}
function input (e, callback) {
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
    callback({
      data: inputState.value,
      type: 'compositionend',
    })
    e.target.value = ''

    /**
     * 这里确保在中文输入法的时候keyup事件不会被触发
     */
    setTimeout(() => {
      inputState.value = ''
      inputState.isComposing = false
    }, 200)
  }
}
