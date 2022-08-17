import Component from '../view/component'
import { computeLen } from '../utils'
export default class Content extends Component {
  $next = (fn) => {
    return Promise.resolve().then(fn)
  }
  constructor(props) {
    super(props)
    this.initState()
  }
  /**
   * 初始化状态
   */
  initState () {
    this.props.data.__component = this
    if (this.props.data.marks) {
      this.state = { marks: this.props.data.marks }
    } else {
      this.state = this.props.data
    }
  }

  /**
   * 更新状态
   * @param {*} path
   * @param {*} range
   * @param {*} editor
   * @memberof Content
   */
  updateState (path, range, editor) {
    this.beforeUpdateState && this.beforeUpdateState({ path, range, editor })
    // 同步更新
    // this.syncUpdate()

    // 异步更新
    return this.setState().then(() => {
      this.afterUpdateState && this.afterUpdateState({ range, editor, path })
    })
  }

  /**
   * 内容长度
   * @readonly
   * @memberof Content
   */
  get contentLength () {
    return this.state.marks.reduce((prev, ele) => {
      return prev + computeLen(ele)
    }, 0)
  }

  /**
   *
   * 删除动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onBackspace (path, range, editor) {
    const startOffset = range.startOffset
    if (startOffset > 0) {
      path.node.data = path.node.data.slice(0, startOffset - 1) + path.node.data.slice(startOffset)
      if (path.node.data === '') {
        const prevSibling = this.getPrevPath(path).lastLeaf
        path.delete()
        if (prevSibling) {
          range.setStart(prevSibling, prevSibling.node.data.length)
        }
      } else {
        range.startOffset -= 1
      }
    } else {
      const prevSibling = this.getPrevPath(path).lastLeaf
      if (prevSibling) {
        range.setStart(prevSibling, prevSibling.node.data.length)
      }
    }
    range.collapse(true)
    this.updateState(path, range, editor)
  }
  // 光标进入
  onCaretEnter (path, range, isStart) {
    // debugger
    if (isStart) {
      range.setEnd(path, 0)
    } else {
      range.setStart(path, path.len)
    }
    return { path, range }
  }
  // 光标离开
  onCaretLeave (path, range, isStart) {
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
   * 箭头上动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowUp (path, range, editor) {
    console.error('组件未实现onArrowUp方法')
  }
  /**
   *
   * 箭头下动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowDown (path, range, editor) {
    console.error('组件未实现onArrowDown方法')
  }
  /**
   *
   * 箭头右动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowRight (path, range, editor) {
    range.endOffset += 1
  }
  /**
   *
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onArrowLeft (path, range, editor, shiftKey) {
    range.startOffset -= 1
  }
  /**
   *
   * 回车动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  onEnter (path, range, editor) {
    console.error('组件未实现onEnter方法')
  }
  getPrevPath (path) {
    return path.prevSibling || this.getPrevPath(path.parent)
  }
  getNextPath (path) {
    return path.nextSibling || this.getNextPath(path.parent)
  }
  dispatch (name, path, range, editor, ...args) {
    const method =
      this[`on${name.replace(/(\w)(\w+)/, ($0, $1, $2) => `${$1.toUpperCase()}${$2}`)}`]
    if (method) {
      switch (name) {
        case 'arrowLeft':
        case 'arrowRight':
          if (
            (range.startOffset === 0 && name === 'arrowLeft') ||
            (range.startOffset === path.len && name === 'arrowRight')
          ) {
            this.onCaretLeave(path, range, range.startOffset === 0)
          } else {
            this._invokeAction(method, path, range, editor, ...args)
          }
          const shiftKey = args[0]
          if (!shiftKey) {
            range.collapse(name === "arrowLeft")
          } else {

          }
          // !args[0] && range.collapse(true) // 如果没有shiftKey，则折叠
          // this.updateState(path, range, editor) // 更新状态
          break

        default:
          this._invokeAction(method, path, range, editor, ...args)
          break
      }
    }
  }
  _invokeAction (method, path, range, editor, ...args) {
    method.call(this, path, range, editor, ...args)
  }
}
