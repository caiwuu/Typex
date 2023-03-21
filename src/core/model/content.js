import Component from '../view/component'
import { horizontalMove, verticalMove } from '../defaultActions/caretMove'
import { del } from '../defaultActions/delete'
import { input } from '../defaultActions/input'
import { enter } from '../defaultActions/enter'

/**
 * @description 内容管理类
 * @export
 * @class Content
 * @extends {Component}
 */
export default class Content extends Component {
  _type = 'inline'
  constructor(props) {
    super(props)
    this.initState()
  }

  /**
   * @description 内容长度
   * @readonly
   * @memberof Content
   */
  get contentLength() {
    return this.$path.len
  }

  /**
   * @description 对应路径
   * @readonly
   * @memberof Content
   */
  get $path() {
    return this.props.path
  }

  /**
   * @description 编辑器实例
   * @readonly
   * @memberof Content
   */
  get $editor() {
    return this.props.editor
  }
  /**
   * @description 初始化状态
   * @memberof Content
   */
  initState() {
    this.$path._$component = this
  }

  /**
   * @description 更新状态
   * @param {*} path
   * @param {*} range
   * @returns {*}
   * @memberof Content
   */
  update(path, range) {
    // 执行更新前钩子
    this.onBeforeUpdate && this.onBeforeUpdate({ path: path || this.$path, range })
    return this.setState().then(() => {
      // 执行更新后钩子
      this.onAfterUpdate && this.onAfterUpdate({ range, path })
    })
  }

  /**
   * @description 输入处理
   * @param {*} path
   * @param {*} range
   * @param {*} data
   * @memberof Content
   */
  contentInput(path, range, data) {
    const { offset, endContainer } = range
    path.insertData(offset, data)
    this._updatePoints(endContainer, offset, data.length)
    this.update().then(() => {
      range.collapse(false)
      range.updateCaret()
    })
  }

  /**
   * @description  删除动作
   * @param {*} commonPath 最近公共路径
   * @param {*} range 区间
   * @memberof Content
   */
  contentDelete(commonPath, range) {
    const { endContainer, endOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        commonPath.contentDelete(endOffset, 1)
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
   * @description 光标进入
   * @param {*} path
   * @param {*} range
   * @param {*} direction
   * @returns {*}
   * @memberof Content
   */
  caretEnter(path, range, direction) {
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
   * @description 光标离开
   * @param {*} path
   * @param {*} range
   * @param {*} direction 从哪个方向离开
   * @returns {*}
   * @memberof Content
   */
  caretLeave(path, range, direction) {
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
   * @description 箭头右动作
   * @param {*} path 路径
   * @param {*} range cursorForward
   * @memberof Content
   */
  caretForward(path, range) {
    range.offset < path.len && (range.offset += 1)
  }
  /**
   *
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  caretBackward(path, range) {
    range.offset > 0 && (range.offset -= 1)
  }

  /**
   * @description 获取上一个叶子
   * @param {*} path
   * @returns {*}
   * @memberof Content
   */
  getPrevLeafPath(path) {
    if (!path) return null
    return (path.prevSibling || this.getPrevLeafPath(path.parent))?.lastLeaf
  }

  /**
   * @description  获取下一个叶子
   * @param {*} path
   * @returns {*}
   * @memberof Content
   */
  getNextLeafPath(path) {
    if (!path) return null
    return (path.nextSibling || this.getNextLeafPath(path.parent))?.firstLeaf
  }

  /**
   * @description 光标移动处理
   * @param {*} direction
   * @param {*} range
   * @param {*} event
   * @returns {*}
   * @memberof Content
   */
  caretMove(direction, range, event) {
    const path = range.container
    const caretMoveMethod = this[`${direction === 'left' ? 'caretBackward' : 'caretForward'}`]
    const { shiftKey } = event
    let res = { path, range }
    // 重置 d
    if (range.d === 0) range.d = direction === 'left' ? -1 : 1
    if (this.caretWillBeLeaving(path, range, direction)) {
      // 跨path移动 先执行跨ptah动作 再执行path内移动动作
      res = this.caretLeave(path, range, direction)
    } else {
      // path内移动 执行path内移动动作
      caretMoveMethod(path, range, event)
    }
    if (!shiftKey) {
      range.collapse(direction === 'left')
    }
    return res
  }

  /**
   * @description 键盘左箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onKeydownArrowLeft(range, event) {
    horizontalMove('left', range, event)
  }

  /**
   * @description 键盘右箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onKeydownArrowRight(range, event) {
    horizontalMove('right', range, event)
  }

  /**
   * @description 键盘上箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onKeydownArrowUp(range, event) {
    verticalMove('up', range, event)
  }

  /**
   * @description 键盘下箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onKeydownArrowDown(range, event) {
    verticalMove('down', range, event)
  }

  /**
   * @description 键盘空格处理
   * @param {*} range
   * @memberof Content
   */
  onKeydownBackspace(range) {
    del(range, false)
  }

  /**
   * @description 键盘回车处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onKeydownEnter(range, event) {
    enter(range, event)
  }

  /**
   * @description 键盘输入处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   */
  onInput(range, event) {
    input(range, event)
  }

  /**
   * @description 检测光标是否要离开path
   * @param {*} path
   * @param {*} range
   * @param {*} direction
   * @returns {*}
   * @memberof Content
   */
  caretWillBeLeaving(path, range, direction) {
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
   * @description range端点更新
   * @param {*} container
   * @param {*} position
   * @param {*} distance
   * @param {*} newContainer
   * @memberof Content
   */
  _updatePoints(container, position, distance, newContainer) {
    this.$editor.selection.updatePoints(container, position, distance, newContainer)
  }

  /**
   * @description 获取选中的叶子节点迭代器
   * @param {*} range
   * @returns {*}
   * @memberof Content
   */
  getSeletedPath(range) {
    let start,
      end,
      value,
      done = false
    if (range.collapsed) {
      done = true
    } else {
      if (range.startOffset === 0) {
        start = range.startContainer
      } else if (range.startOffset === range.startContainer.len) {
        start = range.startContainer.nextLeaf
      } else {
        const startSplits = range.startContainer.split(range.startOffset)
        this._updatePoints(
          range.startContainer,
          range.startOffset + 1,
          -range.startOffset,
          startSplits[1]
        )
        start = startSplits[1]
      }

      if (range.endOffset === 0) {
        end = range.endContainer.prevLeaf
      } else if (range.endOffset === range.endContainer.len) {
        end = range.endContainer
      } else {
        const endSplits = range.endContainer.split(range.endOffset)
        this.$editor.selection.updatePoints(
          range.endContainer,
          range.endOffset + 1,
          -range.endOffset,
          endSplits[1]
        )
        end = endSplits[0]
      }
    }

    value = start
    return {
      length: 0,
      next: function () {
        if (!done) {
          const res = { value, done }
          done = value === end
          value = value.nextLeaf
          this.length++
          return res
        } else {
          return { value: undefined, done }
        }
      },
      [Symbol.iterator]: function () {
        return this
      },
    }
  }

  /**
   * @description 格式设置
   * @param {*} range
   * @param {*} event
   * @param {function} callback 格式处理回调
   * @memberof Content
   */
  setFormat(range, event, callback) {
    if (event.ctrlKey) {
      event.preventDefault()
      const commonPath = this.$editor.queryCommonPath(range.startContainer, range.endContainer)
      const selectedPath = this.getSeletedPath(range)
      for (const p of selectedPath) {
        callback(p.node.formats)
      }
      commonPath.component.update()
    }
  }
}
