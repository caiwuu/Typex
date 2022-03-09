import { EventProxy, Selection, registerActions } from '../core'
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
  mount (id) {
    this.host = id
    this.ui.render()
    new EventProxy(this)
    registerActions(this)
  }
  setTools (tools) {
    this.tools = [...tools]
  }
  execComand (command) {
    console.log(command)
    textParse(this.selection.getRangeAt(0))
  }
  on (eventName, fn) {
    this.emitter.on(eventName, fn)
  }
  emit (eventName, ...args) {
    this.emitter.emit(eventName, args)
  }
  focus () {
    this.emitter.emit('focus')
  }
}

function textParse (range) {
  if (range.collapsed) {
    range.startVNode.splitNode(range.startOffset)
  } else if (range.startVNode.type === 'text') {
    range.startVNode.splitNode(range.startOffset)
  } else if (range.endVNode.type === 'text') {
    range.endVNode.splitNode(range.endOffset)
  }
  let parentNode = null
  const sbn = getLayer(range.startVNode)
  const ebn = getLayer(range.endVNode)
  if (sbn === ebn) {
    parentNode = sbn
    const p = parse(parentNode)
    console.log(p)
  }
  // const commonAncestorNode = getCommonAncestorNode(range.startVNode, range.endVNode)
}
function parse (vnode, inherit = {}) {
  const marker = mark(vnode, inherit)
  if (vnode.children.length) {
    return vnode.children.map((i) => parse(i, marker)).flat()
  } else {
    return { content: vnode, mark: marker }
  }
}

function mark (vnode, inherit = {}) {
  if (!vnode.children.length) return inherit
  return {
    B: vnode.tagName === 'strong' || inherit.B || null,
    I: vnode.tagName === 'em' || inherit.I || null,
    U: vnode.tagName === 'u' || inherit.U || null,
    D: vnode.tagName === 'del' || inherit.D || null,
    FC: vnode.styles.get('color') || inherit.FC || null,
    BG: vnode.styles.get('background') || inherit.BG || null,
    FZ: vnode.styles.get('font-size') || vnode.styles.get('fontSize') || inherit.FZ || null,
  }
}
