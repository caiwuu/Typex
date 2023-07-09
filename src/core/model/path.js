import { getVdomOrElm, getVdomOrPath } from '../mappings'
import { computeLen, typeOf, positionCompare, isPrimitive, uuid } from '../utils'

/**
 * @description 路径类
 * @export
 * @class Path
 */
export class Path {
  /**
   * @description 重建标记 0：无操作 ；1：删除
   * @protected
   * @memberof Path
   */
  rebuildFlag = 0
  _uuid = uuid()
  render () {
    return this.$editor.formater.render(this)
  }
  constructor({ node, parent, position, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.position = position
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get isBlock () {
    return this === this?.component.$path && this?.component.displayType === 'block'
  }
  get $editor () {
    return this._editor || this.parent.$editor
  }

  /**
   * @description path所属组件的实例
   * @readonly
   * @memberof Path
   */
  get component () {
    return this._$component || this.parent?.component
  }

  /**
   * @description path内容长度
   * @readonly
   * @memberof Path
   */
  get length () {
    return computeLen(this)
  }

  /**
   * @description path对应的真实dom
   * @readonly
   * @memberof Path
   */
  get elm () {
    return getVdomOrElm(this.vn)
  }

  /**
   * @description 路径类型
   * @readonly
   * @memberof Path
   */
  get pathType () {
    switch (this.dataType) {
      case 'String':
        return 3
      case 'Object':
        return 2
      case 'Array':
        return 1
    }
  }
  /**
   * @description 数据类型
   * @readonly
   * @memberof Path
   */
  get dataType () {
    return typeOf(this.node.data)
  }

  /**
   * @description path所属的块级组件实例
   * @readonly
   * @memberof Path
   */
  get block () {
    if (this.component?.displayType === 'block') return this.component
    return this.parent.block
  }

  /**
   * @description path对应的虚拟dom
   * @readonly
   * @memberof Path
   */
  get vn () {
    return getVdomOrPath(this)
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
   * @description 同级索引
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
    return (this.prevSibling || this.parent?.prevLeaf)?.lastLeaf
  }

  /**
   * @description 下一个叶子节点
   * @readonly
   * @memberof Path
   */
  get nextLeaf () {
    return (this.nextSibling || this.parent?.nextLeaf)?.firstLeaf
  }

  /**
   * @description 文本插入
   * @param {String} pos 从根节点组成的索引链 如'0-0-1-1-2'
   * @param {String} data 插入字符
   * @memberof Path
   */
  insertData (pos, data) {
    this.node.data = this.node.data.slice(0, pos) + data + this.node.data.slice(pos)
  }

  /**
   * @description 内容删除
   * @param {Number} offset 偏移量,开始删除的位置
   * @param {Number} count  删除的字符数量
   * @memberof Path
   */
  textDelete (offset, count) {
    this.node.data = this.node.data.slice(0, offset - count) + this.node.data.slice(offset)
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
   * @description 设置格式(只会merge格式，不会强制覆盖其他格式)
   * @param {Object} formats 格式
   * @memberof Path
   */
  setFormat (formats) {
    Object.assign(this.node.formats, formats)
  }
  /**
   * @description path分割
   * @param {Number} index 分隔位置
   * @returns {Path[]} path列表
   * @memberof Path
   */
  split (index) {
    if (this.pathType === 3) {
      const newPath = createPath({
        data: this.node.data.slice(index),
        formats: { ...this.node.formats },
      })
      this.textDelete(this.length, this.length - index)
      newPath.insertAfter(this)
      return [this, newPath]
    } else {
      const newPath = createPath({
        data: [],
        formats: { ...this.node.formats },
      })
      this.children.slice(index).forEach((path) => {
        path.moveTo(newPath)
      })
      newPath.insertAfter(this)
      return [this, newPath]
    }
  }

  /**
   * @description 标记克隆
   * @returns {Path}
   * @memberof Path
   */
  clone (cloneChild = false) {
    let data
    if (cloneChild) {
      data = isPrimitive(this.node.data)
        ? this.node.data
        : JSON.parse(JSON.stringify(this.node.data))
    } else {
      data = isPrimitive(this.node.data) ? '' : this.node.data ? [] : {}
    }
    return createPath({
      data,
      formats: { ...this.node.formats },
    })
  }

  /**
   * @description - 位置比较
   * @example
   * res = a.positionCompare(b),
   * res=-1: a<b;
   * res=0: a===b;
   * res=1: a>b
   * @param {Path} path
   * @returns {Number}
   * @memberof Path
   */
  positionCompare (path) {
    return positionCompare(this, path)
  }

  /**
   * @description 是否源于 xxx
   * @param {Path} path
   * @returns {Boolean}
   * @memberof Path
   */
  originOf (path) {
    return this.position.includes(path.position + '-')
  }

  /**
   * @description 插入到path前面
   * @param {Path} path
   * @memberof Path
   */
  insertBefore (path) {
    this.delete()
    path.parent.splice(path.index, 0, this)
  }

  /**
   * @description 插入到path后面
   * @param {Path} path
   * @memberof Path
   */
  insertAfter (path) {
    this.delete()
    path.parent.splice(path.index + 1, 0, this)
  }
  /**
   * @description 移动到path的children
   * @param {Path} path
   * @memberof Path
   */
  moveTo (path) {
    this.delete()
    path.push(this)
  }
  /**
   * @description path删除
   * @memberof Path
   */
  delete () {
    if (!this.parent) {
      return
    }
    this.rebuildFlag = 1
    this.parent.rebuild()
    console.log(this.parent === this.$editor.$path, this);
    this.parent.component.update()
  }

  /**
   * @description 尾部插入children
   * @param {*} paths
   * @memberof Path
   */
  push (...paths) {
    paths.forEach((i) => (i.rebuildFlag = 0))
    this.children.push(...paths)
    this.rebuild()
    this.component.update()
  }

  /**
   * @description 从尾部弹出元素
   * @returns {*}
   * @memberof Path
   */
  pop () {
    const item = this.children[this.children.length - 1]
    item.rebuildFlag = 1
    this.rebuild()
    this.component.update()
    return item
  }

  /**
   * @description 从头部插入children
   * @param {*} paths
   * @memberof Path
   */
  unshift (...paths) {
    paths.forEach((i) => (i.rebuildFlag = 0))
    this.children.unshift(...paths)
    this.rebuild()
    this.component.update()
  }

  /**
   * @description 从头部弹出元素
   * @returns {*}
   * @memberof Path
   */
  shift () {
    const item = this.children[0]
    item.rebuildFlag = 1
    this.rebuild()
    this.component.update()
    return item
  }

  /**
   * @description 通过移除或者替换已存在的元素和/或添加新元素就地改变一个数组的内容
   * @param {*} start
   * @param {*} deleteCount
   * @param {*} additems
   * @returns {deleteItems}
   * @memberof Path
   */
  splice (start, deleteCount, ...additems) {
    const deleteItems = []
    if (additems.length) {
      additems.forEach((i) => (i.rebuildFlag = 0))
      this.children.splice(start, 0, ...additems)
    }
    if (deleteCount > 0) {
      for (let index = 0; index < deleteCount; index++) {
        const element = this.children[index + start]
        element.rebuildFlag = 1
        deleteItems.push[element]
      }
    }
    this.rebuild()
    this.component.update()
    return deleteItems
  }

  // /**
  //  * @description 插入到path后面
  //  * @param {Path} path
  //  * @memberof Path
  //  */
  // insertChildrenAfter(path) {
  //   path.parent.children.splice(path.index + 1, 0, ...this.children)
  //   this.delete()
  //   this.parent.rebuild()
  //   // path.parent.rebuild()
  // }
  /**
   * @description 删除两个节点之间的所有节点 不包含开始结束节点
   * @param {Path} startPath 开始节点
   * @param {Path} endPath 结束节点
   * @memberof Path
   */
  deleteBetween (startPath, endPath) {
    if (this === startPath || this === endPath || startPath === endPath) return
    const traverse = (path) => {
      for (var i = 0; i < path.children.length; i++) {
        const ele = path.children[i]
        if (startPath.originOf(ele) || endPath.originOf(ele)) {
          traverse(ele)
        } else if (ele.positionCompare(startPath) === 1 && ele.positionCompare(endPath) === -1) {
          ele.rebuildFlag = 1
        }
      }
    }
    traverse(this)
    const commonPath = this.$editor.queryCommonPath(startPath, endPath)
    commonPath.rebuild()
  }
  /**
   * @description 重构链表树
   * @memberof Path
   */
  rebuild () {
    if (this.dataType !== 'Array') return
    let cachePath = null
    this.children = this.children.filter((ele) => ele.rebuildFlag !== 1)
    // 为了保持索引，使用length = 0来清空数组
    this.node.data.length = 0
    this.children.forEach((path, index) => {
      // 更新父级
      path.parent = this
      // 同步mark子节点
      this.node.data.push(path.node)
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
 * @param {Object} node 标记
 * @param node.data {String|Object}
 * @param node.formats {Object}
 * @param {Path} [parent=null]
 * @param {Path} [prevSibling=null]
 * @param {Path} [nextSibling=null]
 * @param {Number} [index=0]
 * @returns {Path}
 */
export function createPath (node, parent = null, prevSibling = null, nextSibling = null, index = 0) {
  const position = parent ? parent.position + '-' + index : '0'
  node.position = position
  if (!node.formats) node.formats = {}
  const config = {
    node: node,
    parent: parent,
    position: position,
    prevSibling: prevSibling,
    nextSibling: nextSibling,
    children: [],
  }
  const path = new Path(config)
  if (node.data) {
    let currPath = null
    node.data.reduce?.((prevPath, currMark, index) => {
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
  if (target.vnodeType) return queryPathByVn(target)
  if (typeof target === 'string') return queryPathByPosition(target, path)
  throw 'queryPath的参数必须是elm|vn|position'
}

/**
 * @description 根据dom查询path
 * @param {*} elm
 * @returns {*}
 */
function queryPathByElm (elm) {
  const vn = getVdomOrElm(elm)
  if (!vn) return null
  return queryPathByVn(vn)
}

/**
 * @description 根据虚拟dom查询path
 * @param {*} vn
 * @returns {*}
 */
function queryPathByVn (vn) {
  const path = getVdomOrPath(vn)
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
