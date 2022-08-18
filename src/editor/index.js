import emit from 'mitt'
import mount from './mount'
import { Selection, registerActions, queryPath, createPath } from '@/core'
import { initIntercept } from '@/platform'
import './formats'
let path = null
class Editor {
  ui = {
    body: null,
  }
  constructor(options) {
    this.init(options)
  }
  init(options) {
    this.$marks = options.marks
    this.$emitter = emit()
    this.selection = new Selection(this)
    registerActions(this)
  }
  mount(id) {
    this.ui.body = document.getElementById(id)
    initIntercept(this)
    mount.call(this, id)
  }
  on(eventName, fn) {
    this.$emitter.on(eventName, fn)
  }
  emit(eventName, args) {
    this.$emitter.emit(eventName, args)
  }
  focus() {
    this.$emitter.emit('focus')
  }
  queryPath(elm, offset = 0) {
    return queryPath(elm, path, offset)
  }
}
function initMarks(data) {
  return {
    data: {
      marks: [
        {
          data: {
            marks: [{ data, formats: { color: 'green' } }],
          },
          formats: { paragraph: true },
        },
      ],
    },
    formats: { root: true },
  }
}
export default function createEditor(options = {}) {
  const marks = initMarks(options.data)
  path = createPath(marks)
  return new Editor({ marks })
}
