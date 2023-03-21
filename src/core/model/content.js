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
  /**
   * @description 类型
   * @readonly
   * @memberof Content
   * @instance
   */
  get _type() {
    return 'inline'
  }
  constructor(props) {
    super(props)
    this.initState()
  }

  /**
   * @description 内容长度
   * @readonly
   * @memberof Content
   * @instance
   */
  get contentLength() {
    return this.$path.len
  }

  /**
   * @description 对应路径
   * @readonly
   * @memberof Content
   * @instance
   */
  get $path() {
    return this.props.path
  }

  /**
   * @description 编辑器实例
   * @readonly
   * @memberof Content
   * @instance
   */
  get $editor() {
    return this.props.editor
  }
  /**
   * @description 初始化状态
   * @memberof Content
   * @instance
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
   * @instance
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
   * @instance
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
   * @instance
   */
  onContentDelete(commonPath, range) {
    const { endContainer, endOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        commonPath.onContentDelete(endOffset, 1)
        if (commonPath.len === 0) {
          this.onCaretLeave(commonPath, range, 'left')
          commonPath.delete()
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevLeaf = commonPath.prevLeaf
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        if (prevLeaf) {
          prevLeaf.component.onCaretEnter(prevLeaf, range, 'right')
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
   * @instance
   */
  onCaretEnter(path, range, direction) {
    if (direction === 'left') {
      let fromPath = path.prevLeaf
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
   * @instance
   */
  onCaretLeave(path, range, direction) {
    if (direction === 'left') {
      let toPath = path.prevLeaf
      if (!toPath) return {}
      return toPath.component.onCaretEnter(toPath, range, 'right')
    } else {
      // 从尾部离开
      let toPath = path.nextLeaf
      if (!toPath) return {}
      return toPath.component.onCaretEnter(toPath, range, 'left')
    }
  }

  /**
   * @description 箭头右动作
   * @param {*} path 路径
   * @param {*} range cursorForward
   * @memberof Content
   * @instance
   */
  onCaretForward(path, range) {
    range.offset < path.len && (range.offset += 1)
  }

  /**
   *
   * @description 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   * @instance
   */
  onCaretBackward(path, range) {
    range.offset > 0 && (range.offset -= 1)
  }

  /**
   * @description 光标移动处理
   * @param {*} direction
   * @param {*} range
   * @param {*} event
   * @returns {*}
   * @memberof Content
   * @instance
   */
  onCaretMove(direction, range, event) {
    const path = range.container
    const caretMoveMethod = this[`${direction === 'left' ? 'onCaretBackward' : 'onCaretForward'}`]
    const { shiftKey } = event
    let res = { path, range }
    // 重置 d
    if (range.d === 0) range.d = direction === 'left' ? -1 : 1
    if (this.onCaretWillBeLeaving(path, range, direction)) {
      // 跨path移动 先执行跨ptah动作 再执行path内移动动作
      res = this.onCaretLeave(path, range, direction)
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
   * @instance
   */
  onKeydownArrowLeft(range, event) {
    horizontalMove('left', range, event)
  }

  /**
   * @description 键盘右箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowRight(range, event) {
    horizontalMove('right', range, event)
  }

  /**
   * @description 键盘上箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowUp(range, event) {
    verticalMove('up', range, event)
  }

  /**
   * @description 键盘下箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowDown(range, event) {
    verticalMove('down', range, event)
  }

  /**
   * @description 键盘空格处理
   * @param {*} range
   * @memberof Content
   * @instance
   */
  onKeydownBackspace(range) {
    del(range, false)
  }

  /**
   * @description 键盘回车处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownEnter(range, event) {
    enter(range, event)
  }

  /**
   * @description 键盘输入处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onInput(range, event) {
    input(range, event)
  }

  /**
   * @description 检测光标是否要离开当前组件
   * @param {Path} path - 路径
   * @param {Range} range - 选取范围
   * @param {'left'|'right'} direction - 方向
   * @returns {Boolean}
   * @memberof Content
   * @instance
   */
  onCaretWillBeLeaving(path, range, direction) {
    if (direction === 'left' && range.offset <= 1) {
      let toPath = path.prevLeaf
      if (!toPath) return false
      // 细节处理:同块不同文本光标左移，两个path的交界处 取前一个path的右端点
      const isSameBlock = path.blockComponent === toPath.blockComponent
      if (range.offset === 0) {
        return true
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
   * @instance
   */
  _updatePoints(container, position, distance, newContainer) {
    this.$editor.selection.updatePoints(container, position, distance, newContainer)
  }

  /**
   * @description 获取选中的叶子节点迭代器
   * @param {Range} range 选区范围
   * @returns {Iterator} 迭代器
   * @memberof Content
   * @instance
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
   * @instance
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
