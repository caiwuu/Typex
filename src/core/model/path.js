import { getVnOrElm, getVnOrPath, getVnOrIns } from '../mappings'
import { computeLen } from '../utils'
/**
 * @desc: path的链表树
 * @return {*}
 */
export class Path {
  constructor({ node, parent, position, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.position = position
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get component() {
    return this._$component || this.parent.component
  }
  get len() {
    return computeLen(this)
  }
  get elm() {
    if (typeof this.vn.type === 'function') {
      return getVnOrElm(getVnOrIns(this.vn.ins))
    }
    return getVnOrElm(this.vn)
  }
  get pathType() {
    return typeof this.node.data === 'string' ? 3 : 1
  }
  get blockComponent() {
    if (this.component._type === 'block') return this.component
    return this.parent.blockComponent
  }
  get vn() {
    return getVnOrPath(this)
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
   * 内容插入
   * @param {*} pos
   * @param {*} data
   * @memberof Path
   */
  insertData(pos, data) {
    this.node.data = this.node.data.slice(0, pos) + data + this.node.data.slice(pos)
  }

  /**
   * 内容删除
   * @param {*} pos
   * @param {*} count
   * @memberof Path
   */
  deleteData(pos, count) {
    this.node.data = this.node.data.slice(0, pos - count) + this.node.data.slice(pos)
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
    this._$component = this.parent.component
  }

  /**
   * @desc: path删除
   * @return {*}
   */
  delete() {
    if (!this.parent) {
      return
    }
    // 为了保持链表的连续性 paths 子集长度不能为零
    // console.trace()
    // console.log(this.parent.node.data.marks)
    // if (this.parent.node.data.marks.length === 1) {
    //   this.format()
    //   return
    // }
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
      const newPosition = this.position + '-' + index
      if (path.position !== newPosition) {
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

function queryRootPath(path) {
  while (path.parent) {
    path = path.parent
  }
  return path
}
/**
 * @desc: 查找共同祖先path
 * @param {elm|vn|position} target
 * @param {path} path
 * @return {path}
 */
export function queryCommonPath(path1, path2) {
  if (path1.position === '0') return path1
  if (path2.position === '0') return path2
  const rootPath = queryRootPath(path1)
  const posArr1 = path1.position.split('-')
  const posArr2 = path2.position.split('-')
  const minLen = Math.min(posArr1.length, posArr2.length)
  let i
  for (i = 0; i < minLen; i++) {
    const element1 = posArr1[i]
    const element2 = posArr2[i]
    if (element1 !== element2) break
  }
  const commonPosition = posArr1.slice(0, i).join('-')
  return queryPathByPosition(commonPosition, rootPath)
}
/**
 * @desc: path查找
 * @param {elm|vn|position} target
 * @param {path} path
 * @return {path}
 */
export function queryPath(target, path) {
  if (target instanceof Path) return target
  if (target.nodeType) return queryPathByElm(target)
  if (target._isVnode) return queryPathByVn(target)
  if (typeof target === 'string') return queryPathByPosition(target, path)
  throw 'queryPath的参数必须是elm|vn|position'
}
function queryPathByElm(elm) {
  const vn = getVnOrElm(elm)
  if (!vn) return null
  return queryPathByVn(vn)
}
function queryPathByVn(vn) {
  const path = getVnOrPath(vn)
  if (!path) return null
  return path
}
function queryPathByPosition(position, rootPath) {
  const posArr = position.split('-')
  return posArr.slice(1).reduce((prev, index) => {
    return prev.children[index]
  }, rootPath)
}
