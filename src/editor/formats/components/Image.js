/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-27 10:58:17
 */
import { Content } from '@/core'
export default class Image extends Content {
  render() {
    return (
      <swapper>
        <img
          onMousedown={this.onMousedown}
          onClick={this.sizeChange}
          {...this.props.path.node.data}
        ></img>
      </swapper>
    )
  }
  // 阻止事件冒泡导致光标移动
  onMousedown = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  sizeChange = (e) => {
    if (this.props.path.node.data.width === '50px') {
      this.props.path.node.data.width = '200px'
      this.props.path.node.data.height = '200px'
    } else {
      this.props.path.node.data.width = '50px'
      this.props.path.node.data.height = '50px'
    }
    this.update()
  }
  onAfterUpdate() {
    this.props.editor.selection.updateCaret()
  }
  onBackspace(path, range) {
    const { endOffset, collapsed } = range
    if (collapsed) {
      if (endOffset > 0) {
        const parent = this.props.path.parent.component
        path.delete()
        parent.update()
        parent.onCaretEnter(this.props.path.parent, range, false)
      } else {
        const prevSibling = this.getPrevPath(path).lastLeaf
        if (prevSibling) {
          prevSibling.component.onCaretEnter(prevSibling, range, false)
        }
      }
    }
  }
  onCaretEnter(path, range, isStart) {
    range.set(path.elm, isStart ? 0 : 1)
    return { path, range }
  }
  get contentLength() {
    return 1
  }
}
