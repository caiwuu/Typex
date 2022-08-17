import { getVnOrElm, getVnOrMark, getVnOrIns } from '../mappings'
import { computeLen } from '../utils'
/**
 * @desc: path mark的链表树
 * @return {*}
 */
class Path {
  constructor({ node, parent, position, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.position = position
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get component() {
    return this.node.data.__component || this.parent.component
  }
  get len() {
    return computeLen(this.node)
  }
  get elm() {
    if (typeof this.vn.type === 'function') {
      return getVnOrElm(getVnOrIns(this.vn.ins))
    }
    return getVnOrElm(this.vn)
  }
  get vn() {
    return getVnOrMark(this.node)
  }
  get isLeaf() {
    return this.children.length === 0
  }
  get firstLeaf() {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[0]
    }
    return path
  }
  get lastLeaf() {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[path.children.length - 1]
    }
    return path
  }
  get index() {
    return this.position.split('-').slice(-1)[0] / 1
  }

  /**
   * @desc: 格式化内容和格式
   * @param {*} data
   * @param {*} formats
   * @return {*}
   */
  format({ data = '', formats = {} } = {}) {
    this.node.data = data
    this.node.formats = formats
  }

  /**
   * @desc: path删除
   * @return {*}
   */
  delete() {
    if (!this.parent) {
      return
    }
    // 为了保持链表的连续性 marks长度不能为零
    if (this.parent.node.data.marks.length === 1) {
      this.format()
      return
    }
    this.prevSibling && (this.prevSibling.nextSibling = this.nextSibling)
    this.nextSibling && (this.nextSibling.prevSibling = this.prevSibling)
    this.parent.children.splice(this.index, 1)
    this.parent.node.data.marks.splice(this.index, 1)
    this.parent.reArrange()
  }

  /**
   * @desc: 重新设置位置信息
   * @return {*}
   */
  reArrange() {
    this.children.forEach((path, index) => {
      const oldPosition = path.position
      const newPosition = this.position + '-' + index
      if (oldPosition !== newPosition) {
        path.position = path.node.position = newPosition
        path.reArrange()
      }
    })
  }

  /**
   * @desc: 深度优先遍历
   * @param {*} fn
   * @return {*}
   */
  traverse(fn) {
    fn(this)
    if (this.children && this.children.length) {
      for (let index = 0; index < this.children.length; index++) {
        const path = this.children[index]
        path.traverse(fn)
      }
    }
  }
  stop() {}
  skip() {}
}

/**
 * @desc: 创建path
 * @return {*}
 */
export function createPath(
  current,
  parent = null,
  prevSibling = null,
  nextSibling = null,
  index = 0
) {
  const position = parent ? parent.position + '-' + index : '0'
  current.position = position
  const config = {
    node: current,
    parent: parent,
    position: position,
    prevSibling: prevSibling,
    nextSibling: nextSibling,
    children: [],
  }
  const path = new Path(config)
  if (current.data.marks) {
    let currPath = null
    current.data.marks.reduce((prevPath, currMark, index) => {
      currPath = createPath(currMark, path, prevPath, null, index)
      if (prevPath) {
        prevPath.nextSibling = currPath
      }
      currPath.prevSibling = prevPath
      path.children.push(currPath)
      return currPath
    }, null)
  }
  return path
}
/**
 * @desc:
 * @param {elm|mark|position} target
 * @param {path} path
 * @param {number} offset
 * @return {path}
 */
export function queryPath(target, path, offset = 0) {
  let position
  if (!target) return
  // 通过elm查询
  if (target.nodeType) {
    const vn = getVnOrElm(target)
    if (!vn) return null
    const mark = getVnOrMark(vn)
    if (!mark) return null
    position = mark.position
  } else {
    // 通过mark或者position查询
    position = target.position || target
  }
  const posArr = position.split('-')
  return posArr.slice(1).reduce((prev, index) => {
    return prev.children[index]
  }, path)
}
