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
// mark 测试demo 可行性验证
function textParse (range) {
  // if (range.collapsed) {
  //   range.startVNode.splitNode(range.startOffset)
  // } else if (range.startVNode.type === 'text') {
  //   range.startVNode.splitNode(range.startOffset)
  // } else if (range.endVNode.type === 'text') {
  //   range.endVNode.splitNode(range.endOffset)
  // }
  let parentNode = null
  const sbn = getLayer(range.startVNode)
  const ebn = getLayer(range.endVNode)
  if (sbn === ebn) {
    parentNode = sbn
    const marks = parse(parentNode)
    const group = { marks, keys: ['B', 'I', 'U', 'D', '$FC', '$BG', '$FZ'], tags: null }
    const res = gen(group)
    console.log('rebuild', res);
  }
  // const commonAncestorNode = getCommonAncestorNode(range.startVNode, range.endVNode)
}
function parse (vnode, inherit = {}, idx = 0) {
  const marker = idx === 0 ? {} : mark(vnode, inherit)
  idx++
  if (vnode.children.length) {
    return vnode.children.map((i) => parse(i, marker, idx)).flat()
  } else {
    return { content: vnode, mark: marker }
  }
}
/**
 * dom -> 特征提取 -> mark-> group -> 归并 -> gen vnode -> diff->update dom
 * @param {*} vnode 
 * @param {*} inherit 
 * @returns 
 */
function mark (vnode, inherit = {}) {
  if (!vnode.children.length) return inherit
  return {
    B: vnode.tagName === 'strong' || inherit.B,
    I: vnode.tagName === 'em' || inherit.I,
    U: vnode.tagName === 'u' || inherit.U,
    D: vnode.tagName === 'del' || inherit.D,
    $FC: vnode.styles.get('color') || inherit.$FC,
    $BG: vnode.styles.get('background') || inherit.$BG,
    $FZ: vnode.styles.get('font-size') || vnode.styles.get('fontSize') || inherit.$FZ,
  }
}
function divide (group, index = 0, res = []) {
  let counter = {}
  const g = { marks: [], tags: [], keys: [] }
  let prev = null
  let prevMaxLen = 0
  for (index; index < group.marks.length; index++) {
    let copyCounter = { ...counter }
    const current = group.marks[index]
    group.keys.forEach((key) => {
      if (!prev) {
        counter[key] = 0
        current.mark[key] && counter[key]++
      } else {
        if ((current.mark[key] && current.mark[key] === prev.mark[key]) || (current.mark[key] && !prev.mark[key])) {
          counter[key]++
        }
      }
    })
    const len = Math.max(...Object.values(counter))
    if (prev && prevMaxLen === 0 && len > prevMaxLen) {
      counter = copyCounter
      break
    }
    if (prev && len === prevMaxLen && len !== 0) {
      counter = copyCounter
      break
    }
    g.marks.push(current)
    g.tags = Object.entries(counter)
      .filter((ele) => ele[1] && ele[1] === len)
      .map((ele) => ele[0])
    g.keys = group.keys.filter((ele) => !g.tags.includes(ele))
    prevMaxLen = len
    prev = current
  }
  res.push(g)
  if (index < group.marks.length) {
    return divide(group, index, res)
  } else {
    return res
  }
}
const toVnodeOpsMap = {
  B: () => ({ tag: 'strong', attrs: {}, children: [] }),
  I: () => ({ tag: 'em', attrs: {}, children: [] }),
  U: () => ({ tag: 'u', attrs: {}, children: [] }),
  D: () => ({ tag: 'del', attrs: {}, children: [] }),
  $FC: (value) => ({ style: `color:${value};` }),
  $BG: (value) => ({ style: `background:${value};` }),
  $FZ: (value) => ({ style: `font-size:${value};` }),
}
function gen (group) {
  const res = divide(group, 0)
  console.log("标记阶段", res);
  const obj = res.map((ele, index) => {
    if (!ele.tags.length) {
      return { tag: 'text', attrs: {}, children: ele.marks.map((ele) => ele.content.context).join('') }
    } else {
      let result = null
      ele.tags.reduce((obj, curr) => {
        if (!obj) {
          if (curr.startsWith("$")) {
            result = {
              tag: 'span',
              attrs: toVnodeOpsMap[curr](ele.marks[0].mark[curr]),
              children: []
            }
          } else {
            result = toVnodeOpsMap[curr]()
          }
          return result
        } else {
          if (curr.startsWith("$")) {
            const attr = toVnodeOpsMap[curr](ele.marks[0].mark[curr])
            if (!obj.attrs.style) {
              obj.attrs.style = attr.style
            } else {
              obj.attrs.style += attr.style
            }
            return obj
          } else {
            const child = toVnodeOpsMap[curr]()
            obj.children.push(child)
            return child
          }
        }

      }, result)
      if (ele.marks.length) {
        let lastChild = result
        while (lastChild.children.length) {
          lastChild = lastChild.children[0]
        }
        lastChild.children = gen(ele)
      }
      return result
    }
  })
  return obj
}