import createElement from './createElement'
export default function transfer(args, range, state = 0) {
  return {
    range,
    root: args,
    args,
    state,
    toMarks(fn) {
      this.args = getContentMark(this.args, this.range)
      if (typeof fn === 'function') {
        this.args = fn(this.args) || this.args
      }
      this.state = 1
      return this
    },
    toJson(fn) {
      this.args = generate({
        marks: this.args,
        keys: ['B', 'I', 'U', 'D', '$FC', '$BG', '$FZ'],
        tags: null,
      })
      if (typeof fn === 'function') {
        this.args = fn(this.args) || this.args
      }
      this.state = 2
      return this
    },
    toVNode(fn) {
      if (this.state === 0) throw Error('The target is already a VNode')
      if (this.state === 1) {
        this.toJson()
      }
      this.args = json2VNode(this.args, this.range)
      if (typeof fn === 'function') {
        this.args = fn(this.args) || this.args
      }
      this.state = 0
      return this
    },
  }
}

function json2VNode(list, range) {
  return list.map((ele) => {
    const res = createElement(
      ele.tagName,
      { ...ele.attrs },
      typeof ele.children === 'string' ? ele.children : json2VNode(ele.children, range)
    )
    if (ele.startOffset !== undefined) range.setStart(res, ele.startOffset)
    if (ele.endOffset !== undefined) range.setEnd(res, ele.endOffset)
    return res
  })
}
function getContentMark(vnode, range, inherit = {}, idx = 0) {
  const marker = idx === 0 ? {} : mark(vnode, inherit)
  // 选区之外的节点和不可编辑的节点被标记为static，
  // static节点不会有标记重组的过程，diff过程也大大节约性能
  if (vnode.editable === 'off' || (vnode.type === 'block' && idx)) {
    return {
      content: vnode,
      static: true,
    }
  } else if (vnode.children.length) {
    return vnode.children.map((i) => getContentMark(i, range, marker, ++idx)).flat()
  } else if (vnode.tagName === 'text') {
    // 选区在同一容器
    if (vnode === range.startVNode && range.startVNode === range.endVNode) {
      const res = []
      vnode.context.slice(0, range.startOffset) &&
        res.push({
          content: vnode.context.slice(0, range.startOffset),
          mark: { ...marker },
          selected: false,
        })
      res.push({
        content: vnode.context.slice(range.startOffset, range.endOffset),
        mark: { ...marker },
        selected: true,
        start: true,
        end: true,
      })
      vnode.context.slice(range.endOffset) &&
        res.push({
          content: vnode.context.slice(range.endOffset),
          mark: { ...marker },
          selected: false,
        })
      return res
    }
    if (vnode === range.startVNode) {
      const res = []
      vnode.context.slice(0, range.startOffset) &&
        res.push({
          content: vnode.context.slice(0, range.startOffset),
          mark: { ...marker },
          selected: false,
        })
      res.push({
        content: vnode.context.slice(range.startOffset),
        mark: { ...marker },
        selected: range.startOffset !== vnode.length,
        start: true,
      })
      return res
    }
    if (vnode === range.endVNode) {
      const res = [
        {
          content: vnode.context.slice(0, range.endOffset),
          mark: { ...marker },
          selected: range.endOffset !== 0,
          end: true,
        },
      ]
      vnode.context.slice(range.endOffset) &&
        res.push({
          content: vnode.context.slice(range.endOffset),
          mark: { ...marker },
          selected: false,
        })
      return res
    }
    return {
      content: vnode.context,
      mark: marker,
      selected:
        range.startVNode.position < vnode.position && vnode.position < range.endVNode.position,
    }
  }
}
function mark(vnode, inherit = {}) {
  if (!vnode.children.length) return { ...inherit }
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
// 分组
function divide(group, index = 0, res = []) {
  let counter = {}
  const g = { marks: [], tags: [], keys: [] }
  let prev = null
  let prevMaxLen = 0
  for (index; index < group.marks.length; index++) {
    let copyCounter = { ...counter }
    const current = group.marks[index]
    if (current.static) {
      if (!prev) {
        g.marks.push(current)
        g.static = true
        index++
      }
      break
    }
    group.keys.forEach((key) => {
      if (!prev) {
        counter[key] = 0
        current.mark[key] && current.content && counter[key]++
      } else {
        if (
          (current.mark[key] && current.mark[key] === prev.mark[key]) ||
          (current.mark[key] && !prev.mark[key])
        ) {
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
  B: () => ({ tagName: 'strong', attrs: {}, children: [] }),
  I: () => ({ tagName: 'em', attrs: {}, children: [] }),
  U: () => ({ tagName: 'u', attrs: {}, children: [] }),
  D: () => ({ tagName: 'del', attrs: {}, children: [] }),
  $FC: (value) => ({ style: `color:${value};` }),
  $BG: (value) => ({ style: `background:${value};` }),
  $FZ: (value) => ({ style: `font-size:${value};` }),
}
// 标记重组归并算法
function generate(group) {
  const res = divide(group, 0)
  console.log(res)
  const obj = res.map((ele) => {
    if (ele.static) {
      return {
        tagName: ele.marks[0].content,
        attrs: {},
        children: [],
      }
    } else if (!ele.tags.length) {
      let n = 0
      let startOffset
      let endOffset
      const res = {
        tagName: 'text',
        attrs: {},
        children: ele.marks
          .map((ele) => {
            if (ele.start) {
              startOffset = n
            }
            n += ele.content.length
            if (ele.end) {
              endOffset = n
            }
            return ele.content
          })
          .join(''),
      }
      if (startOffset !== undefined) res.startOffset = startOffset
      if (endOffset !== undefined) res.endOffset = endOffset
      return res
    } else {
      let result = null
      ele.tags.reduce((obj, curr) => {
        if (!obj) {
          if (curr.startsWith('$')) {
            result = {
              tagName: 'span',
              attrs: toVnodeOpsMap[curr](ele.marks[0].mark[curr]),
              children: [],
            }
          } else {
            result = toVnodeOpsMap[curr]()
          }
          return result
        } else {
          if (curr.startsWith('$')) {
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
        lastChild.children = generate(ele)
      }
      return result
    }
  })
  return obj
}
