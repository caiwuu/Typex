import Component from '../view/component'
import { horizontalMove, verticalMove } from '../defaultActions/caretMove'
import { del } from '../defaultActions/delete'
import { input } from '../defaultActions/input'

const mergeBlock = (o, n, shouldUpdates = []) => {
  const oBlock = o.blockComponent
  if (o.blockComponent !== n.blockComponent) {
    if (n.len === 0) {
      n.component.$editor.selection.rangePoints
        .filter((point) => point.container === n)
        .forEach((point) => {
          if (point.pointName === 'start') {
            point.range.setStart(n.nextLeaf, 0)
          } else {
            point.range.setEnd(n.nextLeaf, 0)
          }
        })
    }
    o.blockComponent.$path.insertChildrenAfter(n)
    oBlock.$path.parent.component.update()
    shouldUpdates.forEach((ins) => {
      ins.component.update()
    })
  }
}

/**
 * @description 内容管理类
 * @export
 * @class Content
 * @extends {Component}
 */
export default class Content extends Component {
  get renderContent () {
    return this.$editor.formater.render(this.$path)
  }
  /**
   * @description 类型
   * @readonly
   * @memberof Content
   * @instance
   */
  get _type () {
    return 'inline'
  }
  constructor(props) {
    super(props)
  }

  /**
   * @description 内容长度
   * @readonly
   * @memberof Content
   * @instance
   */
  get contentLength () {
    return this.$path.len
  }

  /**
   * @description 对应路径
   * @readonly
   * @memberof Content
   * @instance
   */
  get $path () {
    return this.props.path
  }

  /**
   * @description 编辑器实例
   * @readonly
   * @memberof Content
   * @instance
   */
  get $editor () {
    return this.props.editor
  }

  /**
   * @description render前调用hook
   * @memberof Content
   * @memberof Content
   */
  onBeforeRender () {
    /*
     * 在diff的时候对于相同的组件类型的vdom,会被当成相同vnode，不会重新创建实例,只会切换props,
     * 但是一定会调用render，因此需要在这里切换path的组件上下文
     */
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
  update (path, range) {
    // 执行更新前钩子
    this.onBeforeUpdate && this.onBeforeUpdate({ path: path || this.$path, range })
    return this.setState().then(() => {
      this.$editor.selection.updateCaret()
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
   * @desc: 删除动作
   * @param {*} commonPath
   * @param {*} range
   * @return {*}
   */
  onContentDelete (commonPath, range) {
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        // 执行删除
        startContainer.textDelete(endOffset, 1)
        if (this.contentLength === 0) {
          // 对于块级 当执行删除块内容为空时候 将被br填充 此时光标停留在段首
          range.setStart(startContainer, 0)
        } else if (startContainer.len === 0) {
          const { path: prevSibling } = this.onCaretLeave(startContainer, range, 'left')
          if (!prevSibling) return
          if (prevSibling.blockComponent !== startContainer.blockComponent) {
            range.setStart(startContainer, 0)
          } else {
            startContainer.delete()
          }
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const { path: prevSibling } = this.onCaretLeave(startContainer, range, 'left')
        if (!prevSibling) return
        if (!this.contentLength) {
          const parent = this.$path.parent.component
          this.$path.delete()
          parent.update()
        }
        mergeBlock(startContainer, prevSibling)
      }
    } else if (startContainer === endContainer) {
      startContainer.textDelete(endOffset, endOffset - startOffset)
    } else {
      startContainer.textDelete(startContainer.len, startContainer.len - startOffset)
      endContainer.textDelete(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      mergeBlock(endContainer, startContainer)
    }
    range.collapse(true)
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
  onCaretEnter (path, range, direction) {
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
  onCaretLeave (path, range, direction) {
    if (direction === 'left') {
      let toPath = path.prevLeaf
      if (!toPath) return {}
      return toPath.component.onCaretEnter(toPath, range, 'right')
    } else {
      console.log(this.$path.lastLeaf, path)
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
  onCaretForward (path, range) {
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
  onCaretBackward (path, range) {
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
  onCaretMove (direction, range, event) {
    const path = range.container
    const caretMoveMethod = this[`${direction === 'left' ? 'onCaretBackward' : 'onCaretForward'}`]
    const { shiftKey } = event
    let res = { path, range }
    // 重置 d
    if (range.d === 0) range.d = direction === 'left' ? -1 : 1
    if (this.isCaretShouldLeavePath(path, range, direction)) {
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
   * @description 换行
   * @param {Range} range
   * @param {event} [event=null]
   * @memberof Content
   */
  onLinefeed (range, event = null) {
    if (range.inputState.isComposing) return
    event?.preventDefault?.()
    if (!range.collapsed) {
      del(range)
    }
    const startSplits = range.container.split(range.offset)
    const cloneParent = range.container.parent.cloneMark()
    range.container.parent.children.slice(startSplits[1].index).forEach((path) => {
      path.moveTo(cloneParent)
    })
    cloneParent.insertAfter(range.container.parent)
    cloneParent.parent.component.update()
    range.set(startSplits[1], 0)
    range.collapse(true)
  }
  /**
   * @description 键盘左箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowLeft (range, event) {
    horizontalMove('left', range, event)
    this.$editor.selection.updateCaret()
  }

  /**
   * @description 键盘右箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowRight (range, event) {
    horizontalMove('right', range, event)
    this.$editor.selection.updateCaret()
  }

  /**
   * @description 键盘上箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowUp (range, event) {
    verticalMove('up', range, event)
    this.$editor.selection.updateCaret()
  }

  /**
   * @description 键盘下箭头处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownArrowDown (range, event) {
    verticalMove('down', range, event)
    this.$editor.selection.updateCaret()
  }

  /**
   * @description 键盘空格处理
   * @param {*} range
   * @memberof Content
   * @instance
   */
  onKeydownBackspace (range) {
    del(range, false)
  }

  /**
   * @description 键盘回车处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onKeydownEnter (range, event) {
    this.onLinefeed(range, event)
  }

  /**
   * @description 键盘输入处理
   * @param {*} range
   * @param {*} event
   * @memberof Content
   * @instance
   */
  onInput (range, event) {
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
  isCaretShouldLeavePath (path, range, direction) {
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
  _updatePoints (container, position, distance, newContainer) {
    this.$editor.selection.updatePoints(container, position, distance, newContainer)
  }

  /**
   * @description 格式设置
   * @param {*} range
   * @param {function} callback 格式处理回调
   * @memberof Content
   * @instance
   */
  setFormat (range, callback) {
    const commonPath = this.$editor.queryCommonPath(range.startContainer, range.endContainer)
    const selectedPath = this.$editor.selection.getSeletedPath()
    for (const path of selectedPath) {
      callback(path)
    }
    commonPath.component.update()
  }
}
