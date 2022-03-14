import { EventProxy, Selection, registerActions, transfer } from '../core'
import emit from 'mitt'
import UI from './ui'
import { getCommonAncestorNode, getLayer } from '../core/share/utils'
export default class Editor {
  tools = []
  constructor() {
    this.ui = new UI(this)
    this.emitter = emit()
    this.selection = new Selection(this)
  }
  mount(id) {
    this.host = id
    this.ui.render()
    new EventProxy(this)
    registerActions(this)
  }
  setTools(tools) {
    this.tools = [...tools]
  }
  execComand(command) {
    console.log(command)
    textParse(this.selection.getRangeAt(0))
  }
  on(eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  emit(eventName, ...args) {
    this.emitter.emit(eventName, args)
  }
  focus() {
    this.emitter.emit('focus')
  }
}
// mark 测试demo 可行性验证
function textParse(range) {
  if (range.collapsed) {
    range.startVNode.splitNode(range.startOffset)
  } else {
    if (range.endVNode.type === 'text') {
      range.endVNode.splitNode(range.endOffset)
    }
    if (range.startVNode.type === 'text') {
      range.startVNode.splitNode(range.startOffset)
    }
  }
  let parentNode = null
  const sbn = getLayer(range.startVNode)
  const ebn = getLayer(range.endVNode)
  if (sbn === ebn) {
    parentNode = sbn
    transfer(parentNode)
      .toMarks((args) => {
        console.log(args)
        // return args
      })
      // .toJson((args) => {
      //   console.log(args)
      //   return args
      // })
      .toVNode((ele) => {
        console.log(ele)
      })
  }
}
