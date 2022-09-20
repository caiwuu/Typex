/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-20 14:54:11
 */
import { Content } from '@/core'
export default class Image extends Content {
  render() {
    return (
      <img
        onMousedown={this.onMousedown}
        onClick={this.sizeChange}
        {...this.props.path.node.data}
      ></img>
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
  onCaretEnter(path, range, isStart) {
    range.set(path.parent, path.index + isStart ? 0 : 1)
    return { path, range }
  }
  get contentLength() {
    return 1
  }
}
