import { getVnOrElm, getVnOrPath, getVnOrIns } from '../mappings'
import { computeLen, positionCompare, isPrimitive } from '../utils'


/**
 * @description 路径类
 * @export
 * @class Path
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

  /**
   * @description 所属组件实例
   * @readonly
   * @memberof Path
   */
  get component () {
    return this._$component || this.parent.component
  }

  /**
   * @description 内容长度
   * @readonly
   * @memberof Path
   */
  get len () {
    return computeLen(this)
  }

  /**
   * @description 对应的真实dom
   * @readonly
   * @memberof Path
   */
  get elm () {
    if (typeof this.vn.type === 'function') {
      return getVnOrElm(getVnOrIns(this.vn.ins))
    }
    return getVnOrElm(this.vn)
  }

  /**
   * @description 路径类型
   * @readonly
   * @memberof Path
   */
  get pathType () {
    return typeof this.node.data === 'string' ? 3 : 1
  }

  /**
   * @description 最近块级组件实例
   * @readonly
   * @memberof Path
   */
  get blockComponent () {
    if (this.component._type === 'block') return this.component
    return this.parent.blockComponent
  }

  /**
   * @description 对应的虚拟dom
   * @readonly
   * @memberof Path
   */
  get vn () {
    return getVnOrPath(this)
  }

  /**
   * @description 是否是叶子节点
   * @readonly
   * @memberof Path
   */
  get isLeaf () {
    return this.children.length === 0
  }

  /**
   * @description 第一个叶子节点
   * @readonly
   * @memberof Path
   */
  get firstLeaf () {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[0]
    }
    return path
  }

  /**
   * @description 最后一个叶子节点
   * @readonly
   * @memberof Path
   */
  get lastLeaf () {
    let path = this
    while (path.children && path.children.length) {
      path = path.children[path.children.length - 1]
    }
    return path
  }

  /**
   * @description 索引
   * @readonly
   * @memberof Path
   */
  get index () {
    return this.position.split('-').slice(-1)[0] / 1
  }

  /**
   * @description 上一个叶子节点
   * @readonly
   * @memberof Path
   */
  get prevLeaf () {
    return (this.prevSibling || this.parent?.prevSibling)?.lastLeaf
  }

  /**
   * @description 下一个叶子节点
   * @readonly
   * @memberof Path
   */
  get nextLeaf () {
    return (this.nextSibling || this.parent?.nextSibling)?.firstLeaf
  }


  /**
   * @description 内容插入
   * @param {*} pos
   * @param {*} data
   * @memberof Path
   */
  insertData (pos, data) {
    this.node.data = this.node.data.slice(0, pos) + data + this.node.data.slice(pos)
  }


  /**
   * @description 内容删除
   * @param {*} pos
   * @param {*} count
   * @memberof Path
   */
  contentDelete (pos, count) {
    this.node.data = this.node.data.slice(0, pos - count) + this.node.data.slice(pos)
  }


  /**
   * @description 清除格式
   * @memberof Path
   */
  clearFormat () {
    this.node.formats = {}
  }

  /**
   * @description 设置节点
   * @param {*} [{ data = '', formats = {} }={}]
   * @memberof Path
   */
  setNode ({ data = '', formats = {} } = {}) {
    this.node.data = data
    this.node.formats = formats
  }
  /**
   * @description 设置格式
   * @param {*} formats
   * @memberof Path
   */
  setFormat (formats) {
    Object.assign(this.node.formats, formats)
  }
  /**
   * @description path分割
   * @param {*} index
   * @returns {*}  
   * @memberof Path
   */
  split (index) {
    if (!this.isLeaf) throw 'Non-leaf nodes are indivisible'
    const newPath = createPath({
      data: this.node.data.slice(index),
      formats: { ...this.node.formats }
    })
    this.contentDelete(this.len, this.len - index)
    newPath.insertAfter(this)
    return [this, newPath]
  }

  /** 
   * @description 标记克隆
   * @returns {Path}  
   * @memberof Path
   */
  cloneMark () {
    return createPath({
      data: isPrimitive(this.node.data) ? '' : this.node.data.marks ? { marks: [] } : {},
      formats: { ...this.node.formats }
    })
  }
  /**
   * @description path删除
   * @param {boolean} [notEmpty=false]
   * @memberof Path
   */
  delete (notEmpty = false) {
    if (!this.parent) {
      return
    }
    this._shouldDelete = true
    this.parent.rebuild()
    if (notEmpty && !this.parent.len) {
      this.parent.delete(true)
    }
  }

  /**
   * @description 位置比较
   * @param {*} path
   * @returns {*}  
   * @memberof Path
   */
  positionCompare (path) {
    return positionCompare(this, path)
  }

  /**
   * @description 是否源于 xxx
   * @param {*} path
   * @returns {*}  
   * @memberof Path
   */
  originOf (path) {
    return this.position.includes(path.position + '-')
  }

  /**
   * @description 插入到path前面
   * @param {*} path
   * @memberof Path
   */
  insertBefore (path) {
    path.parent.children.splice(path.index, 0, this)
    this.delete(true)
    path.parent.rebuild()
  }

  /**
   * @description 插入到path后面
   * @param {*} path
   * @memberof Path
   */
  insertAfter (path) {
    path.parent.children.splice(path.index + 1, 0, this)
    this.delete(true)
    path.parent.rebuild()
  }
  /**
   * @description 移动到path的children
   * @param {*} path
   * @memberof Path
   */
  moveTo (path) {
    path.children.push(this)
    this.delete(true)
    path.rebuild()
  }

  /**
   * @description 插入到path前面
   * @param {*} path
   * @memberof Path
   */
  insertChildrenBefore (path) {
    path.parent.children.splice(path.index, 0, ...this.children)
    this.delete(true)
    path.parent.rebuild()
  }

  /**
   * @description 插入到path后面
   * @param {*} path
   * @memberof Path
   */
  insertChildrenAfter (path) {
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
  deleteBetween (startPath, endPath) {
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
   * @description 重构链表树
   * @memberof Path
   */
  rebuild () {
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
 * @description 创建path
 * @export
 * @param {*} current
 * @param {*} [parent=null]
 * @param {*} [prevSibling=null]
 * @param {*} [nextSibling=null]
 * @param {number} [index=0]
 * @returns {*}  
 */
export function createPath (
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
 * @description 查询根路径
 * @param {*} path
 * @returns {*}  
 */
function queryRootPath (path) {
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
export function queryCommonPath (path1, path2) {
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
export function queryPath (target, path) {
  if (target instanceof Path) return target
  if (target.nodeType) return queryPathByElm(target)
  if (target._isVnode) return queryPathByVn(target)
  if (typeof target === 'string') return queryPathByPosition(target, path)
  throw 'queryPath的参数必须是elm|vn|position'
}

/**
 * @description 根据dom查询path
 * @param {*} elm
 * @returns {*}  
 */
function queryPathByElm (elm) {
  const vn = getVnOrElm(elm)
  if (!vn) return null
  return queryPathByVn(vn)
}

/**
 * @description 根据虚拟dom查询path
 * @param {*} vn
 * @returns {*}  
 */
function queryPathByVn (vn) {
  const path = getVnOrPath(vn)
  if (!path) return null
  return path
}

/**
 * @description 根据坐标查询path
 * @param {*} position
 * @param {*} rootPath
 * @returns {*}  
 */
function queryPathByPosition (position, rootPath) {
  const posArr = position.split('-')
  return posArr.slice(1).reduce((prev, index) => {
    return prev.children[index]
  }, rootPath)
}
