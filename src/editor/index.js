import emit from 'mitt'
import { mountContent } from './renderRoot'
import { Selection, EventProxy, registerActions, queryPath } from '@/core'
import { initIntercept } from '@/platform'
import './formats'
export default class Editor {
  ui = {
    body: null,
  }
  constructor(id) {
    this.setup(id)
  }
  setup(id) {
    // 这里执行顺序非常重要
    this.emitter = emit()
    this.ui.body = document.getElementById(id)
    mountContent(id, this)
    initIntercept(this)
    this.selection = new Selection(this)
    registerActions(this)
  }
  on(eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  emit(eventName, args) {
    this.emitter.emit(eventName, args)
  }
  focus() {
    this.emitter.emit('focus')
  }
  queryPath(elm, offset = 0) {
    return queryPath(elm, this.path, offset)
  }
}
