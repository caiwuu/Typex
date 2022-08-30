/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-30 15:10:31
 */
export function del(range, force = false) {
  if (range.inputState.isComposing && !force) return
  // debugger
  if (range.collapsed) {
    const { startContainer, startOffset } = range
    // 非文本
    if (startContainer.nodeType !== 3) {
      console.log(this.queryPath(startContainer.childNodes[startOffset - 1]))
      return
    } else {
      // 文本
      let path = this.queryPath(startContainer, startOffset)
      const component = path.component
      component.onBackspace(path, range, this)
    }
  } else {
    range.collapse(true)
  }
}

export default function () {
  this.selection.ranges.forEach((range) => {
    // this.editor.emit('delete', { range, force: false })
    del.call(this, range, false)
  })
  Promise.resolve().then(() => {
    this.selection.ranges.forEach((range) => {
      range.updateCaret()
    })
  })
}
