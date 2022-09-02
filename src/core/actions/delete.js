/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-02 09:49:35
 */
export function del(range, force = false) {
  if (range.inputState.isComposing && !force) return
  // if (range.collapsed) {
  const { startContainer, startOffset, endContainer } = range
  // 非文本
  if (startContainer.nodeType !== 3) {
    console.log(this.queryPath(startContainer.childNodes[startOffset - 1]))
    return
  } else {
    // 文本
    let path = this.queryCommonPath(startContainer, endContainer)
    const component = path.component
    component.onBackspace(path, range, this)
  }
  // } else {
  console.log(this.queryCommonPath(startContainer, endContainer))
  range.collapse(true)
  // }
}

export default function () {
  this.selection.ranges.forEach((range) => {
    del.call(this, range, false)
  })
  Promise.resolve().then(() => {
    this.selection.ranges.forEach((range) => {
      range.updateCaret()
    })
  })
}
