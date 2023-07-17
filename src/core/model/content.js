import Component from '../view/component'
import { horizontalMove, verticalMove } from '../defaultActions/caretMove'
import { del } from '../defaultActions/delete'
import { input } from '../defaultActions/input'
import { createPath } from './path'
import { uuid } from '../utils'

/**
 * @description 内容管理类
 * @export
 * @class Content
 * @extends {Component}
 */
export default class Content extends Component {
  uuid = uuid()
  get renderContent() {
    return this.$editor.formater.render(this.$path)
  }
  /**
   * @description 类型
   * @readonly
   * @memberof Content
   * @instance
   */
  get displayType() {
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
  get contentLength() {
    return this.$path.length
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
  shouldComponentUpdate() {
    return this.$path.rebuildFlag !== 1
  }
  /**
   * @description render前调用hook
   * @memberof Content
   * @memberof Content
   */
  onBeforeRender() {
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
  update(path, range) {
    // 执行更新前钩子
    this.onBeforeUpdate && this.onBeforeUpdate({ path: path || this.$path, range })
    return this.setState().then(() => {
      this.$editor.selection.drawRangeBg()
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
  onContentDelete(commonPath, range) {
    console.log('删除')
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      const prevLeaf = startContainer.prevLeaf
      if (endOffset > 0) {
        // 执行删除
        startContainer.textDelete(endOffset, 1)

        if (startContainer.block.contentLength === 0) {
          // 块级内容被清空
          range.setStart(startContainer, 0).collapse()
        } else if (startContainer.length === 0) {
          // 块不为空 容器为空
          // 删除容器
          startContainer.delete()

          if (prevLeaf.block !== startContainer.block || !prevLeaf) {
            range.setStart(startContainer.nextLeaf, 0).collapse()
          } else {
            range.setStart(prevLeaf, 0).collapse()
          }
        } else {
          // 容器不为空
          // 平移其他range
          this._updatePoints(endContainer, endOffset, -1)

          // 行内跨标签
          if (prevLeaf.block === startContainer.block && endOffset === 1) {
            range.setStart(prevLeaf, prevLeaf.length).collapse()
          }
        }
      } else {
        // 块为空 光标在头部
        if (startContainer.block.contentLength === 0) {
          startContainer.block.$path.delete()

          range.setStart(prevLeaf, prevLeaf.length).collapse()
          // startContainer.block.$path.parent.component.update().then(() => {
          //   range.updateCaret(true)
          // })
        } else if (startContainer.length === 0) {
          startContainer.delete()
        } else if (startContainer.block !== prevLeaf.block) {
          const startContainerParent = startContainer.parent
          if (prevLeaf.length === 0) {
            prevLeaf.parent.pop()
            prevLeaf.parent.push(...startContainer.parent.children)
            startContainerParent.delete()
            range.setStart(startContainer, 0)
          } else {
            prevLeaf.parent.splice(prevLeaf.index + 1, 0, ...startContainer.parent.children)
            startContainerParent.delete()
            // prevLeaf.parent.component.update()

            // console.log(this.$editor.$path.children[0].component === prevLeaf.parent.component);
            // this.$editor.$path.children[0].component.update()
            // this.$editor.$path.component.update()
            range.setStart(startContainer, 0).collapse()
          }

          // prevLeaf.parent.block.update().then(() => {
          //   range.updateCaret()
          // })
          // return
        } else {
          range.setStart(prevLeaf, prevLeaf.length).collapse()
          this.onContentDelete(range.startContainer, range)
        }
      }
    } else if (startContainer === endContainer) {
      startContainer.textDelete(endOffset, endOffset - startOffset)
      if (startContainer.length === 0) {
        startContainer.delete()
        range.setStart(startContainer.prevLeaf, startContainer.prevLeaf.length).collapse()
      }
    } else {
      startContainer.textDelete(startContainer.length, startContainer.length - startOffset)
      endContainer.textDelete(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      if (startContainer.block !== endContainer.block) {
        endContainer.parent.delete()
        startContainer.parent.splice(startContainer.index + 1, 0, ...endContainer.parent.children)
      }
      range.collapse(true)
      console.log(range.startOffset, range.endOffset, range)
    }
    commonPath.component.update(commonPath, range).then(() => {
      range.updateCaret()
    })
  }
  /**
   * @desc: 删除动作
   * @param {*} commonPath
   * @param {*} range
   * @return {*}
   */
  onContentDelete2(commonPath, range) {
    console.log('删除')
    const { endContainer, endOffset, startContainer, startOffset, collapsed } = range
    // 选区折叠
    if (collapsed) {
      if (endOffset > 0) {
        // 执行删除
        startContainer.textDelete(endOffset, 1)

        if (startContainer.block.contentLength === 0) {
          // 对于块级 当执行删除块内容为空时候 将被br填充 此时光标停留在段首
          range.setStart(startContainer, 0)
        } else if (startContainer.length === 0) {
          const prevLeaf = startContainer.prevLeaf
          if (prevLeaf.block !== startContainer.block || !prevLeaf) {
            range.setStart(startContainer.nextLeaf, 0)
          } else {
            range.setStart(prevLeaf, 0)
          }
          startContainer.delete()
        } else {
          this._updatePoints(endContainer, endOffset, -1)
        }
      } else {
        const prevLeaf = startContainer.prevLeaf
        if (startContainer.block.contentLength === 0) {
          startContainer.block.$path.delete()
          range.setStart(prevLeaf, prevLeaf.length).collapse()
          startContainer.block.$path.parent.component.update().then(() => {
            range.updateCaret(true)
          })
        } else if (startContainer.length === 0) {
          startContainer.delete()
        } else if (startContainer.block !== prevLeaf.block) {
          const startContainerParent = startContainer.parent
          if (prevLeaf.length === 0) {
            prevLeaf.parent.pop()
            prevLeaf.parent.push(...startContainer.parent.children)
            startContainerParent.delete()
            range.setStart(startContainer, 0).collapse()
          } else {
            prevLeaf.parent.splice(prevLeaf.index + 1, 0, ...startContainer.parent.children)
            startContainerParent.delete()
            // prevLeaf.parent.component.update()

            // console.log(this.$editor.$path.children[0].component === prevLeaf.parent.component);
            // this.$editor.$path.children[0].component.update()
            // this.$editor.$path.component.update()
            range.setStart(startContainer, 0).collapse()
          }

          prevLeaf.parent.block.update().then(() => {
            range.updateCaret()
          })
          // return
        } else {
          range.setStart(prevLeaf, prevLeaf.length).collapse()
          this.onContentDelete(range.startContainer, range)
        }
      }
    } else if (startContainer === endContainer) {
      startContainer.textDelete(endOffset, endOffset - startOffset)
      if (startContainer.length === 0) {
        startContainer.delete()
        range.setStart(startContainer.prevLeaf, startContainer.prevLeaf.length).collapse()
      }
    } else {
      startContainer.textDelete(startContainer.length, startContainer.length - startOffset)
      endContainer.textDelete(endOffset, endOffset)
      commonPath.deleteBetween(startContainer, endContainer)
      if (startContainer.block !== endContainer.block) {
        endContainer.parent.delete()
        startContainer.parent.splice(startContainer.index + 1, 0, ...endContainer.parent.children)
      }
      range.collapse(true)
      console.log(range.startOffset, range.endOffset, range)
    }
    commonPath.component.update(commonPath, range).then(() => {
      range.updateCaret()
    })
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
  enterPath(range, direction) {
    let path = null
    if (direction === 'left') {
      const formPath = range.endContainer
      path = formPath.nextLeaf
      if (!path) return {}
      const isSameBlock = formPath.block === path.block
      range.set(path, isSameBlock ? 1 : 0)
    } else {
      const formPath = range.startContainer
      path = formPath.prevLeaf
      if (!path) return {}
      range.set(path, path.length)
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
  leavePath(range, direction) {
    if (direction === 'left') {
      const path = range.startContainer
      let toPath = path.prevLeaf
      if (!toPath) return {}
      return toPath.component.enterPath(range, 'right')
    } else {
      const path = range.endContainer
      // 从尾部离开
      let toPath = path.nextLeaf
      if (!toPath) return {}
      return toPath.component.enterPath(range, 'left')
    }
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
    const { shiftKey } = event
    let res = { path, range }
    // 重置 d
    if (range.d === 0) range.d = direction === 'left' ? -1 : 1
    if (this.isCaretShouldLeavePath(path, range, direction)) {
      // 跨path移动 先执行跨ptah动作 再执行path内移动动作
      res = this.leavePath(range, direction)
    } else {
      if (direction === 'left') {
        range.offset > 0 && (range.offset -= 1)
      } else {
        range.offset < path.length && (range.offset += 1)
      }
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
  onLinefeed(range, event = null) {
    console.log(1)
    if (range.inputState.isComposing) return
    event?.preventDefault?.()
    if (!range.collapsed) {
      del(range)
    }
    let cloneParent
    // 空行回车
    if (!range.container.length) {
      cloneParent = range.container.parent.clone(true)
      cloneParent.insertAfter(range.container.parent)
      range.set(cloneParent.children[0], 0)
    } else {
      cloneParent = range.container.parent.clone()
      let splits = []
      // 这里有三种情况 光标在path左端 在中间 在右端
      if (range.offset === 0) {
        // 在左端
        splits = [range.container.prevSibling || null, range.container]
      } else if (range.offset === range.container.length) {
        // 在右端
        splits = [range.container, range.container.nextSibling || null]
      } else {
        // 在中间
        splits = range.container.split(range.offset)
      }

      if (splits[0] === null) {
        // 向前插入空行
        const newPath = createPath({ data: '' })
        cloneParent.insertBefore(range.container.parent)
        cloneParent.push(newPath)
      } else if (splits[1] === null) {
        // 向后插入空行
        const newPath = createPath({ data: '' })
        cloneParent.insertAfter(range.container.parent)
        cloneParent.push(newPath)
        range.set(cloneParent.children[0], 0)
      } else {
        // 分割光标后的内容到新行
        cloneParent.insertAfter(range.container.parent)
        range.container.parent.children.slice(splits[1].index).forEach((path) => {
          path.moveTo(cloneParent)
        })
        range.set(cloneParent.children[0], 0)
      }
    }

    cloneParent.parent.component.update().then(() => {
      range.collapse(true)
      range.updateCaret()
    })
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
    this.$editor.selection.updateCaret()
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
    this.$editor.selection.updateCaret()
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
    this.$editor.selection.updateCaret()
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
    this.$editor.selection.updateCaret()
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
    this.onLinefeed(range, event)
  }
  onKeydownz(range, event) {
    if (event.ctrlKey) {
      this.$editor.history.undo()
    }
  }
  onKeydownZ(range, event) {
    if (event.ctrlKey) {
      this.$editor.history.todo()
    }
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
   * @description 检测光标是否要离开当前path
   * @param {Path} path - 路径
   * @param {Range} range - 选取范围
   * @param {'left'|'right'} direction - 方向
   * @returns {Boolean}
   * @memberof Content
   * @instance
   */
  isCaretShouldLeavePath(path, range, direction) {
    if (direction === 'left' && range.offset <= 1) {
      let toPath = path.prevLeaf
      if (!toPath) return false
      // 细节处理:同块不同文本光标左移，两个path的交界处 取前一个path的右端点
      const isSameBlock = path.block === toPath.block
      if (range.offset === 0) {
        return true
      } else {
        return isSameBlock
      }
    }
    return direction === 'right' && range.offset === path.length
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
   * @description 格式设置
   * @param {*} range
   * @param {function} callback 格式处理回调
   * @memberof Content
   * @instance
   */
  setFormat(range, callback) {
    const commonPath = this.$editor.queryCommonPath(range.startContainer, range.endContainer)
    const selectedPath = this.$editor.selection.getSeletedPath()
    for (const path of selectedPath) {
      callback(path)
    }
    commonPath.component.update().then(() => {
      range.updateCaret()
      this.$editor.selection.drawRangeBg()
    })
  }
}
