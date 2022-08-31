import Component from '../view/component'
import { computeLen } from '../utils'
export default class Content extends Component {
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
   * 内容长度
   * @readonly
   * @memberof Content
   */
  get contentLength() {
    return this.props.path.children.reduce((prev, path) => {
      return prev + computeLen(path)
    }, 0)
  }

  /**
   * 输入处理
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} range 输入数据
   */
  onInput({ path, range, data }) {
    const pos = range.offset
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    this.update().then(() => {
      range.setStart(path, range.startOffset + data.length)
      range.collapse(true)
      range.updateCaret()
    })
  }

  /**
   *
   * 删除动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onBackspace(path, range) {
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
    this.update(path, range)
  }
  // 光标进入
  onCaretEnter(path, range, isStart) {
    // debugger
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
   * 箭头上动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onArrowUp(path, range) {
    console.error('组件未实现onArrowUp方法')
  }
  /**
   *
   * 箭头下动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  onArrowDown(path, range) {
    console.error('组件未实现onArrowDown方法')
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
  onArrowLeft(path, range, shiftKey) {
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
    return path.prevSibling || this.getPrevPath(path.parent)
  }
  getNextPath(path) {
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
          if (range.d === 0) {
            range.d = name === 'arrowLeft' ? -1 : name === 'arrowRight' ? 1 : 0
          }
          if (
            (range.offset === 0 && name === 'arrowLeft') ||
            (range.offset === path.len && name === 'arrowRight')
          ) {
            this.onCaretLeave(path, range, range.offset === 0)
          } else {
            this._invokeAction(method, path, range, ...args)
          }
          if (!shiftKey) {
            range.collapse(name === 'arrowLeft')
          }
          break

        default:
          this._invokeAction(method, path, range, ...args)
          break
      }
    }
  }
  _invokeAction(method, path, range, ...args) {
    method.call(this, path, range, ...args)
  }
}
