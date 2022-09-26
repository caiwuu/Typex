import Component from '../view/component'
export default class Content extends Component {
  _type = 'inline'
  constructor(props) {
    super(props)
    this.initState()
  }
  /**
   * 初始化状态
   */
  initState() {
    this.props.path._$component = this
  }

  /**
   * 更新状态
   * @param {*} path
   * @param {*} range
   * @memberof Content
   */
  update(path, range) {
    // 执行更新前钩子
    this.onBeforeUpdate && this.onBeforeUpdate({ path, range })
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
  onInput({ path, range, data }) {
    const { offset, endContainer } = range
    path.node.data = path.node.data.slice(0, offset) + data + path.node.data.slice(offset)
    this.props.editor.selection.updatePoints(endContainer, offset, data.length)
    this.update().then(() => {
      range.collapse(false)
      range.updateCaret()
    })
  }

  /**
   * 删除动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onBackspace(path, range) {
    const { endContainer, endOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        path.node.data = path.node.data.slice(0, endOffset - 1) + path.node.data.slice(endOffset)
        if (path.node.data === '') {
          const prevSibling = this.getPrevPath(path).lastLeaf
          path.delete()
          if (prevSibling) {
            range.setStart(prevSibling, prevSibling.node.data.length)
          }
        } else {
          this.props.editor.selection.updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevSibling = this.getPrevPath(path).lastLeaf
        if (prevSibling) {
          range.setEnd(prevSibling, prevSibling.node.data.length)
        }
      }
    } else {
      console.log('TODO')
    }
    this.update(path, range)
  }
  // 光标进入
  onCaretEnter(path, range, isStart) {
    if (isStart) {
      range.set(path, 0)
    } else {
      range.set(path, path.len)
    }
    return { path, range }
  }
  // 光标离开
  onCaretLeave(path, range, isStart) {
    if (isStart) {
      let prev = this.getPrevPath(path)?.lastLeaf
      if (prev) return prev.component.onCaretEnter(prev, range, !isStart)
    } else {
      let next = this.getNextPath(path)?.firstLeaf
      if (next) return next.component.onCaretEnter(next, range, !isStart)
    }
  }

  /**
   *
   * 箭头右动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onArrowRight(path, range) {
    range.offset += 1
  }
  /**
   *
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onArrowLeft(path, range) {
    range.offset -= 1
  }
  /**
   *
   * 回车动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onEnter(path, range) {
    console.error('组件未实现onEnter方法')
  }
  getPrevPath(path) {
    if (!path) return null
    return path.prevSibling || this.getPrevPath(path.parent)
  }
  getNextPath(path) {
    if (!path) return null
    return path.nextSibling || this.getNextPath(path.parent)
  }
  caretMove(name, path, range, ...args) {
    const method =
      this[`on${name.replace(/(\w)(\w+)/, ($0, $1, $2) => `${$1.toUpperCase()}${$2}`)}`]
    const [shiftKey] = args
    if (method) {
      switch (name) {
        case 'arrowLeft':
        case 'arrowRight':
          let res
          if (range.d === 0) {
            range.d = name === 'arrowLeft' ? -1 : name === 'arrowRight' ? 1 : 0
          }
          if (
            (range.offset === 0 && name === 'arrowLeft') ||
            (range.offset === path.len && name === 'arrowRight')
          ) {
            res = this.onCaretLeave(path, range, range.offset === 0 && name === 'arrowLeft')
          } else {
            this._invokeAction(method, path, range, ...args)
            res = { path, range }
          }
          if (!shiftKey) {
            range.collapse(name === 'arrowLeft')
          }
          return res
      }
    }
  }
  _invokeAction(method, path, range, ...args) {
    method.call(this, path, range, ...args)
  }
}
