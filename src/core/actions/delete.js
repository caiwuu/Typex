/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 10:55:36
 */
export function del(range, force = false) {
  if (range.inputState.isComposing && !force) return
  const { endContainer, endOffset, startContainer } = range
  // 非文本
  // if (endContainer.nodeType !== 3) {
  //   console.log(this.queryCommonPath(startContainer, endContainer))
  //   return
  // } else {
  //   // 文本
  //   let path = this.queryCommonPath(startContainer, endContainer)
  //   const component = path.component
  //   component.deleteData(path, range, this)
  // }
  // console.log(this.queryCommonPath(endContainer, endContainer))

  let commonPath = this.queryCommonPath(startContainer, endContainer)
  const component = commonPath.component
  component.deleteData(commonPath, range)
}

export default function () {
  this.selection.ranges.forEach((range) => {
    del.call(this, range, false)
  })
  Promise.resolve().then(() => {
    this.selection.updateCaret()
  })
}
