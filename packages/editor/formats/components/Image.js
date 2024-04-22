/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-28 15:19:34
 */
import { Content } from '@typex/core'
import Static from './Static'

export default class Image extends Content {
  state = {
    initProp: null,
  }
  render () {
    return (
      <div style='display:inline-block'>
        我是image的一部分
        <div
          onMousedown={this.onMousedown}
          onClick={this.sizeChange}
          style='display:inline-block;height:15px;width:15px;background:red;user-select:none'
        ></div>
        <img
          onMousedown={this.onMousedown}
          onClick={this.sizeChange}
          {...this.$path.node.data}
        ></img>
      </div>
    )
  }
  // 阻止事件冒泡导致光标移动
  onMousedown = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  sizeChange = (e) => {
    if (!this.state.initProp) {
      this.state.initProp = { ...this.$path.node.data }
    }
    if (this.$path.node.data.width === this.state.initProp.width) {
      this.$path.node.data.width = '100px'
      this.$path.node.data.height = '100px'
    } else {
      this.$path.node.data.width = this.state.initProp.width
      this.$path.node.data.height = this.state.initProp.height
    }
    this.update()
  }
  onAfterUpdate () {
    this.$editor.selection.updateCaret()
  }
  onContentDelete (path, range) {
    const { endOffset, collapsed } = range
    if (collapsed) {
      if (endOffset > 0) {
        const parent = this.$path.parent.currentComponent
        path.delete()
        parent.update()
        parent.onCaretEnterPath(this.$path.parent, range, false)
      } else {
        const prevSibling = this.getPrevLeafPath(path)
        if (prevSibling) {
          prevSibling.currentComponent.onCaretEnterPath(prevSibling, range, false)
        }
      }
    }
  }
  onCaretEnterPath (path, range, direction) {
    range.set(path, direction === 'left' ? 0 : 1)
    return { path, range }
  }
  get contentLength () {
    return 1
  }
}
