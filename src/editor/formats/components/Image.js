/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-29 14:08:19
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
    range.setStart(path.parent, path.index + isStart ? 0 : 1)
  }
  /**
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @memberof Content
   */
  // onArrowLeft(path, range) {
  //   console.log(path, range)
  //   range.setStart(path.parent, 0)
  // }
  // onArrowLeft(path, range) {
  //   console.log(path, range)
  //   range.setStart(path.parent, 0)
  // }
  get contentLength() {
    return 1
  }
}
