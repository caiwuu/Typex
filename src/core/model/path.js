import { getVnOrElm, getVnOrPath, getVnOrIns } from '../mappings'
import { computeLen, positionCompare } from '../utils'
/**
 * @desc: path的链表树
 * @return {*}
 */
export class Path {
  _shouldDelete = false
  _shouldRebuild = false
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
  get prevLeaf() {
    return (this.prevSibling || this.parent?.prevSibling)?.lastLeaf
  }
  get nextLeaf() {
    return (this.nextSibling || this.parent?.nextSibling)?.firstLeaf
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
  contentDelete(pos, count) {
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
  setFormater(obj) {
    Object.assign(this.node.formats, obj)
  }
  /**
   * @desc: path删除
   * @return {*}
   */
  delete(notEmpty = false) {
    if (!this.parent) {
      return
    }
    this._shouldDelete = true
    this.parent.rebuild()
    if (notEmpty && !this.parent.len) {
      this.parent.delete(true)
    }
  }
  positionCompare(path) {
    return positionCompare(this, path)
  }
  /**
   * 源于 xxx
   */
  originOf(path) {
    return this.position.includes(path.position + '-')
  }
  /**
   * 插入到path前面
   * @param {*} path
   */
  insertBefore(path) {
    path.parent.children.splice(path.index, 0, this)
    this.delete(true)
    path.parent.rebuild()
  }
  /**
   * 插入到path后面
   * @param {*} path
   */
  insertAfter(path) {
    path.parent.children.splice(path.index + 1, 0, this)
    this.delete(true)
    path.parent.rebuild()
  }
  /**
   * 插入到path前面
   * @param {*} path
   */
  insertChildrenBefore(path) {
    path.parent.children.splice(path.index, 0, ...this.children)
    this.delete(true)
    path.parent.rebuild()
  }
  /**
   * 插入到path后面
   * @param {*} path
   */
  insertChildrenAfter(path) {
    path.parent.children.splice(path.index + 1, 0, ...this.children)
    this.delete(true)
    if (path.len === 0) path.delete(true)
    path.parent.rebuild()
  }
  /**
   * 删除两个节点之间的所有节点
   * @param {*} startPath
   * @param {*} endPath
   * @memberof Path
   */
  deleteBetween(startPath, endPath) {
    const pathsToRebuild = []
    if (this === startPath || this === endPath || startPath === endPath) return
    const traverse = (path) => {
      for (var i = 0; i < path.children.length; i++) {
        const ele = path.children[i]
        if (startPath.originOf(ele) || endPath.originOf(ele)) {
          traverse(ele)
        } else if (ele.positionCompare(startPath) === 1 && ele.positionCompare(endPath) === -1) {
          ele._shouldDelete = true
          if (!ele.parent?._shouldRebuild) {
            pathsToRebuild.push(ele.parent)
            ele.parent._shouldRebuild = true
          }
        }
      }
    }
    traverse(this)
    pathsToRebuild.forEach((path) => path.rebuild())
  }
  /**
   * @desc: 重构链表树
   * @return {*}
   */
  rebuild() {
    this._shouldRebuild = false
    let cachePath = null
    this.children = this.children.filter((ele) => {
      if (ele._shouldDelete) {
        ele._shouldDelete = false
      } else {
        return true
      }
    })
    // 为了保持marks索引，使用length = 0来清空数组
    if (this.node.data.marks) this.node.data.marks.length = 0
    this.children.forEach((path, index) => {
      // 更新父级
      path.parent = this
      // 同步mark子节点
      this.node.data.marks.push(path.node)
      // 重新维护链表结构
      path.prevSibling = cachePath
      if (cachePath) {
        cachePath.nextSibling = path
      }
      path.nextSibling = null
      cachePath = path
      // 更新位置坐标
      const newPosition = this.position + '-' + index
      if (path.position !== newPosition) {
        path.position = path.node.position = newPosition
        path.rebuild()
      }
    })
  }
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
  if (path1 === path2) return path1
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
