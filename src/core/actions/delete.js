/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-15 10:11:45
 */
export function del(range, force = false) {
  if (range.inputState.isComposing && !force) return
  // if (range.collapsed) {
  const { endContainer, endOffset, startContainer } = range
  // 非文本
  if (endContainer.nodeType !== 3) {
    console.log(this.queryPath(endContainer.childNodes[endOffset - 1]))
    return
  } else {
    // 文本
    // debugger
    let path = this.queryCommonPath(startContainer, endContainer)
    const component = path.component
    component.onBackspace(path, range, this)
  }
  // } else {
  console.log(this.queryCommonPath(endContainer, endContainer))
  range.collapse(false)
  // }
}

export default function () {
  this.selection.ranges.forEach((range) => {
    del.call(this, range, false)
  })
  Promise.resolve().then(() => {
    this.selection.updateCaret()
  })
}
