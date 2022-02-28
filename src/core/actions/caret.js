import emojiRegexCreater from 'emoji-regex'
import { isEmptyBlock } from '../share/utils'
function left(shiftKey) {
  let container, offset
  if (shiftKey) {
    switch (this._d) {
      case 1:
      case 0:
        container = this.startVNode
        offset = this.startOffset
        this._d = 1
        break
      case 2:
        container = this.endVNode
        offset = this.endOffset
        break
    }
  } else {
    container = this.startVNode
    offset = this.startOffset
  }
  const { node, pos, flag } = getPrevPoint(container, offset)
  if (flag === 404) return flag
  if (shiftKey) {
    switch (this._d) {
      case 0:
      case 1:
        this.setStart(node, pos)
        this._d = 1
        break
      case 2:
        this.setEnd(node, pos)
        break
    }
  } else {
    this.setStart(node, pos)
    this.collapse(true)
    this._d = 0
  }
  // 穿越空块
  if (isEmptyBlock(container) && flag !== 2) {
    return left.call(this, shiftKey)
  }
  if (flag === 1) {
    return left.call(this, shiftKey)
  }
  return flag
}
function right(shiftKey) {
  let container, offset
  if (shiftKey) {
    switch (this._d) {
      case 2:
      case 0:
        container = this.endVNode
        offset = this.endOffset
        this._d = 2
        break
      case 1:
        container = this.startVNode
        offset = this.startOffset
        break
    }
  } else {
    container = this.endVNode
    offset = this.endOffset
  }
  const { node, pos, flag } = getNextPoint(container, offset)
  if (flag === 404) return flag
  if (shiftKey) {
    switch (this._d) {
      case 0:
      case 2:
        this.setEnd(node, pos)
        this._d = 2
        break
      case 1:
        this.setStart(node, pos)
        break
    }
  } else {
    this.setEnd(node, pos)
    this.collapse(false)
    this._d = 0
  }
  if (isEmptyBlock(container) && flag !== 2) {
    return this.right(shiftKey)
  }
  if (flag === 1) {
    return right.call(this, shiftKey)
  }
  return flag
}

function up(shiftKey) {
  // 记录初时x坐标
  const initialRect = { ...this.caret.rect },
    prevRect = { ...this.caret.rect }
  loop.call(this, 'left', initialRect, prevRect, false, shiftKey)
  this.updateCaret(true)
}
function down(shiftKey) {
  const initialRect = { ...this.caret.rect },
    prevRect = { ...this.caret.rect }
  loop.call(this, 'right', initialRect, prevRect, false, shiftKey)
  this.updateCaret(true)
}

function getNextPoint(vnode, pos, flag = 0) {
  if (vnode.isRoot && pos === vnode.length) return { node: null, pos: null, flag: 404 }
  const len = vnode.type === 'text' ? vnode.length : vnode.children.length
  if (pos + 1 > len) {
    flag = vnode.type === 'block' ? 2 : 1
    return getNextPoint(vnode.parentNode, vnode.index + 1, flag)
  } else if (pos + 1 === len) {
    return flag > 0 ? getHead(vnode, pos, flag) : { node: vnode, pos: pos + 1, flag }
  } else {
    return getHead(vnode, flag > 0 ? pos : pos + 1, flag)
  }
}
function getHead(vnode, pos, flag) {
  if (vnode.type === 'text') {
    const emojiRegex = emojiRegexCreater()
    for (const match of vnode.context.matchAll(emojiRegex)) {
      if (pos === match.index + 1) {
        pos = pos + 1
        flag = -2
      }
    }
    return { node: vnode, pos: pos, flag }
  }
  const node = vnode.children[pos]
  if (node.type === 'block') {
    flag = 2
  } else if (node.type === 'inline' && flag === 0) {
    flag = -1
  }

  if (node.children && node.children.length > 0) {
    return getHead(node, 0, flag)
  } else if (node.type === 'text') {
    return { node, pos: 0, flag }
  } else {
    return { node: vnode, pos: pos, flag }
  }
}
/**
 * 2.0 向前光标位点算法
 * @param {*} vnode
 * @param {*} pos
 * @param {*} flag 跨越标识
 * 0 节点内移动
 * -1 不需要向前矫正的跨节点标识
 * 1 需要向前校正的跨节点标识
 * 2 跨行标识
 * -2 emoji 两个字符
 * @returns
 */
function getPrevPoint(vnode, pos, flag = 0) {
  // debugger
  if (pos - 1 < 0) {
    if (vnode.isRoot) {
      return { node: null, pos: null, flag: 404 }
    } else {
      flag = vnode.type === 'block' ? 2 : 1
      return getPrevPoint(vnode.parentNode, vnode.index, flag)
    }
  } else if (pos - 1 === 0) {
    return flag > 0 ? getTail(vnode, pos, flag) : { node: vnode, pos: pos - 1, flag }
  } else {
    return getTail(vnode, flag > 0 ? pos : pos - 1, flag)
  }
}
// R位点
function getTail(vnode, pos, flag) {
  console.log(vnode)
  if (vnode.type === 'text') {
    const emojiRegex = emojiRegexCreater()
    for (const match of vnode.context.matchAll(emojiRegex)) {
      if (pos === match.index + 1) {
        pos = pos - 1
        flag = -2
      }
    }
    return { node: vnode, pos: pos, flag }
  }
  const node = vnode.children[pos - 1]
  if (node.type === 'block') {
    flag = 2
  } else if (node.type === 'inline' && flag === 0) {
    flag = -1
  }
  if (node.children && node.children.length > 0) {
    return getTail(node, node.children.length, flag)
  } else if (node.type === 'text') {
    return { node, pos: node.length, flag }
  } else {
    return { node: vnode, pos: pos, flag }
  }
}
function loop(direct, initialRect, prevRect, lineChanged = false, shiftKey) {
  if (this.collapsed) {
    this._d = 0
  }
  const flag = direct === 'left' ? left.call(this, shiftKey) : right.call(this, shiftKey)
  if (!lineChanged) {
    if (flag === 404) return
    this.updateCaret(false)
  } else {
    if (flag === 404) return
    this.updateCaret(false)
    const currRect = { ...this.caret.rect },
      preDistance = Math.abs(prevRect.x - initialRect.x),
      currDistance = Math.abs(currRect.x - initialRect.x),
      sameLine = isSameLine(initialRect, prevRect, currRect, flag, this.editor)
    if (!(currDistance <= preDistance && sameLine)) {
      direct === 'left' ? right.call(this, shiftKey) : left.call(this, shiftKey)
      this.updateCaret(false)
      return
    }
  }
  const currRect = { ...this.caret.rect },
    sameLine = isSameLine(initialRect, prevRect, currRect, flag, this.editor)
  if (!sameLine) {
    lineChanged = true
  }
  return loop.call(this, direct, initialRect, currRect, lineChanged, shiftKey)
}

function isSameLine(initialRect, prevRect, currRect, flag, editor) {
  // 标识光标是否在同一行移动
  let sameLine = true
  // 判断自动折行 非vnode层面的换行 这里存在判断失误的概率 但是绝大部分情况都能判断
  // 这里通过判断前后两个光标位置距离是否大于一定的值来判断
  if (Math.abs(currRect.x - prevRect.x) > editor.ui.body.ele.offsetWidth - 2 * currRect.h) {
    sameLine = false
  }
  if (flag === 2) {
    sameLine = false
  }
  //光标Y坐标和参考点相同说明光标还在本行，最理想的情况放在最后判断
  if (currRect.y === initialRect.y) {
    sameLine = true
  }
  return sameLine
}
export default { left, right, up, down }
