/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-15 10:05:18
 */
export default function del(force = false) {
  // 正在聚合输入且不是强制执行的时候终止本次操作
  if (this.inputState.isComposing && !force) return
  this.editor.emit('delete', { range: this })
}
