import Component from '../view/component'
export default class Content extends Component {
  _type = 'inline'
  constructor(props) {
    super(props)
    this.initState()
  }
  get contentLength () {
    return this.$path.len
  }
  get $path () {
    return this.props.path
  }
  get $editor () {
    return this.props.editor
  }
  /**
   * 初始化状态
   */
  initState () {
    this.$path._$component = this
  }

  /**
   * 更新状态
   * @param {*} path
   * @param {*} range
   * @memberof Content
   */
  update (path, range) {
    // 执行更新前钩子
    this.onBeforeUpdate && this.onBeforeUpdate({ path: path || this.$path, range })
    return this.setState().then(() => {
      // 执行更新后钩子
      this.onAfterUpdate && this.onAfterUpdate({ range, path })
    })
  }

  /**
   * 输入处理
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} range 输入数据
   */
  contentInput (path, range, data) {
    const { offset, endContainer } = range
    path.insertData(offset, data)
    this._updatePoints(endContainer, offset, data.length)
    this.update().then(() => {
      range.collapse(false)
      range.updateCaret()
    })
  }

  /**
   * 删除动作
   * @param {*} commonPath 路径
   * @param {*} range 区间
   * @memberof Content
   */
  deleteData (commonPath, range) {
    const { endContainer, endOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        commonPath.deleteData(endOffset, 1)
        if (commonPath.len === 0) {
          this.caretLeave(commonPath, range, 'left')
          commonPath.delete()
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevSibling = this.getPrevLeafPath(commonPath)
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        if (prevSibling) {
          prevSibling.component.caretEnter(prevSibling, range, 'right')
        }
      }
    } else {
      console.log('TODO')
    }
    this.update(commonPath, range)
  }
  /**
   * 光标进入
   * @param {*} path
   * @param {*} range
   * @param {*} direction
   * @returns
   */
  caretEnter (path, range, direction) {
    if (direction === 'left') {
      let fromPath = this.getPrevLeafPath(path)
      if (!fromPath) return {}
      const isSameBlock = path.blockComponent === fromPath.blockComponent
      range.set(path, isSameBlock ? 1 : 0)
    } else {
      range.set(path, path.len)
    }
    return { path, range }
  }
  /**
   * 光标离开
   * @param {*} path
   * @param {*} range
   * @param {*} direction 从哪个方向离开
   * @returns
   */
  caretLeave (path, range, direction) {
    if (direction === 'left') {
      let toPath = this.getPrevLeafPath(path)
      if (!toPath) return {}
      return toPath.component.caretEnter(toPath, range, 'right')
    } else {
      // 从尾部离开
      let toPath = this.getNextLeafPath(path)?.firstLeaf
      if (!toPath) return {}
      return toPath.component.caretEnter(toPath, range, 'left')
    }
  }

  /**
   *
   * 箭头右动作
   * @param {*} path 路径
   * @param {*} range 区间 cursorForward
   * @memberof Content
   */
  caretForward (path, range) {
    range.offset < path.len && (range.offset += 1)
  }
  /**
   *
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  caretBackward (path, range) {
    range.offset > 0 && (range.offset -= 1)
  }
  /**
   *
   * 回车动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onEnter (path, range) {
    console.error('组件未实现onEnter方法')
  }
  getPrevLeafPath (path) {
    if (!path) return null
    return (path.prevSibling || this.getPrevLeafPath(path.parent))?.lastLeaf
  }
  getNextLeafPath (path) {
    if (!path) return null
    return (path.nextSibling || this.getNextLeafPath(path.parent))?.firstLeaf
  }
  caretMove (direction, path, range, ...args) {
    const caretMoveMethod = this[`${direction === 'left' ? 'caretBackward' : 'caretForward'}`]
    const [shiftKey] = args
    let res = { path, range }
    // 重置 d
    if (range.d === 0) range.d = direction === 'left' ? -1 : 1
    console.log(this.caretWillBeLeaving(path, range, direction))
    if (this.caretWillBeLeaving(path, range, direction)) {
      // 跨path移动 先执行跨ptah动作 再执行path内移动动作
      res = this.caretLeave(path, range, direction)
    } else {
      // path内移动 执行path内移动动作
      caretMoveMethod(path, range, ...args)
    }
    if (!shiftKey) {
      range.collapse(direction === 'left')
    }
    return res
  }
  /**
   * 检测光标是否要离开path
   * @param {*} path
   * @param {*} range
   * @param {*} direction
   * @return {*}
   */
  caretWillBeLeaving (path, range, direction) {
    if (direction === 'left' && range.offset <= 1) {
      let toPath = this.getPrevLeafPath(path)
      if (!toPath) return false
      // 细节处理:同块不同文本光标左移，两个path的交界处 取前一个path的右端点
      const isSameBlock = path.blockComponent === toPath.blockComponent
      if (range.offset === 0) {
        return !!toPath
      } else {
        return isSameBlock
      }
    }
    return direction === 'right' && range.offset === path.len
  }

  /**
   * range端点更新
   * @param {*} container
   * @param {*} position
   * @param {*} distance
   * @memberof Content
   */
  _updatePoints (container, position, distance) {
    this.$editor.selection.updatePoints(container, position, distance)
  }
}
