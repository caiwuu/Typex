import { getVdomOrElm, getVdomOrPath } from '../mappings'
import { computeLen, typeOf, positionCompare, isPrimitive, uuid } from '../utils'

/**
 * @description 路径类
 * @export
 * @class Path
 */
const currentComponent = Symbol('currentComponent');
const $editor = Symbol('$editor');
export class Path {
  /**
   * @description 重建标记 
   * - 0：无操作 ；1：删除
   * @protected
   * @memberof Path
   */
  rebuildFlag = 0
  _uuid = uuid()
  render () {
    return this.$editor.formater.render(this)
  }

  /**
   * @description 原始数据节点
   * @type {Object}
   * @memberof Path
   */
  node = null

  /**
   * @description 父path
   * @type {Path}
   * @memberof Path
   */
  parent = null

  /**
   * @description 同级相对索引
   * @type {Number}
   * @memberof Path
   */
  index = 0

  /**
   * @description 前一个兄弟path
   * @type {Path}
   * @memberof Path
   */
  prevSibling = null

  /**
   * @description 后一个兄弟path
   * @type {Path}
   * @memberof Path
   */
  nextSibling = null

  /**
   * @description 子级path
   * @type {Array.<Path>}
   * @memberof Path
   */
  children = []

  /**
   * Creates an instance of Path.
   * @param {Object} options - The options object.
   * @param {Object} options.node - 原始数据节点.
   * @param {Path} options.parent - 父path.
   * @param {number} options.index - 同级相对索引.
   * @param {Path} options.prevSibling - 前一个兄弟path.
   * @param {Path} options.nextSibling - 后一个兄弟path.
   * @param {Array.<Path>} options.children - 子级path.
   */
  constructor({ node, parent, index, prevSibling, nextSibling, children }) {
    this.node = node
    this.parent = parent
    this.index = index
    this.prevSibling = prevSibling
    this.nextSibling = nextSibling
    this.children = children
  }
  get rootPath () {
    let root = this
    while (root.parent) {
      root = root.parent
    }
    return root
  }
  /**
   * @description 判断是否是块路径
   * @readonly
   * @memberof Path
   */
  get isBlock () {
    return this === this?.currentComponent.$path && this?.currentComponent.displayType === 'block'
  }

  /**
   * @description 获取编辑器对象
   * @readonly
   * @memberof Path
   */
  get $editor () {
    return this[$editor] || this.parent.$editor
  }

  /**
   * @description 设置编辑器对象
   * @readonly
   * @memberof Path
   */
  set $editor (value) {
    this[$editor] = value
  }
  /**
   * @description path所属组件的实例
   * @readonly
   * @memberof Path
   */
  get currentComponent () {
    return this[currentComponent] || this.parent?.currentComponent
  }

  /**
   * @description 设置currentComponent
   * @readonly
   * @memberof Path
   */
  set currentComponent (val) {
    this[currentComponent] = val
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

  // /**
  //  * @description 路径类型
  //  * @readonly
  //  * @memberof Path
  //  */
  // get pathType () {
  //   switch (this.dataType) {
  //     case 'string':
  //       return 3
  //     case 'object':
  //       return 2
  //     case 'array':
  //       return 1
  //   }
  // }
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
    if (this.currentComponent?.displayType === 'block') return this.currentComponent
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
   * @description 绝对路径
   * @readonly
   * @memberof Path
   */
  get position () {
    if (this.parent) return `${this.parent.position}-${this.index}`
    return '0'
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
   * @description 获取最近共同节点
   * @param {*} path
   * @returns {*}  
   * @memberof Path
   */
  queryCommonPath (path) {
    if (this === path) return this
    if (this.position === '0') return this
    if (path.position === '0') return path
    const rootPath = this.rootPath
    const posArr1 = this.position.split('-')
    const posArr2 = path.position.split('-')
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
   * @description 文本插入
   * @param {String} pos 从偏移量,开始删除的位置
   * @param {String} data 插入字符
   * @memberof Path
   */
  textInsert (offset, data) {
    this.node.data = this.node.data.slice(0, offset) + data + this.node.data.slice(offset)
  }

  /**
   * @description 内容删除
   * @param {Number} offset 偏移量,开始删除的位置
   * @param {Number} count  删除的字符数量
   * @memberof Path
   */
  textDelete (offset, count) {
    const deleteText = this.node.data.slice(offset - count, offset)
    this.node.data = this.node.data.slice(0, offset - count) + this.node.data.slice(offset)
    return deleteText
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
    if (this.dataType === 'string') {
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
    this.parent.currentComponent.update()
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
    this.currentComponent.update()
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
    this.currentComponent.update()
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
    this.currentComponent.update()
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
    this.currentComponent.update()
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
    this.currentComponent.update()
    return deleteItems
  }

  /**
   * @description 删除两个节点之间的所有节点 不包含开始结束节点
   * @param {Path} startPath 开始节点
   * @param {Path} endPath 结束节点
   * @memberof Path
   */
  deleteBetween (startPath, endPath) {
    if (this === startPath || this === endPath || startPath === endPath) return
    const needRebuild = []
    const traverse = (path) => {
      for (var i = 0; i < path.children.length; i++) {
        const ele = path.children[i]
        if (startPath.originOf(ele) || endPath.originOf(ele)) {
          traverse(ele)
        } else if (ele.positionCompare(startPath) === 1 && ele.positionCompare(endPath) === -1) {
          ele.rebuildFlag = 1
          if (!needRebuild.includes(ele.parent)) {
            needRebuild.push(ele.parent)
          }
        }
      }
    }
    traverse(this)
    needRebuild.forEach((path) => path.rebuild())
  }
  /**
   * @description 重构链表树
   * @memberof Path
   */
  rebuild (deep = false) {
    if (this.dataType !== 'array') return
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
      path.index = index
      // 更新位置坐标
      // const newPosition = this.position + '-' + index
      // if (path.position !== newPosition || deep) {
      //   path.position = path.node.position = newPosition
      //   path.rebuild(deep)
      // }
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
  if (!node.formats) node.formats = {}
  const config = {
    node: node,
    parent: parent,
    index: index,
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
