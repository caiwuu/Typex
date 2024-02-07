/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-14 16:15:36
 */
export default class History {
  size = 50
  queue = []
  idx = -1
  editor = null
  constructor({ size, editor }) {
    this.size = size || 50
    this.editor = editor
  }
  get current() {
    return this.queue[this.idx]
  }
  push(transaction) {
    if (this.current === transaction) return
    if (this.queue.length === this.size) {
      this.queue.shift()
    } else {
      this.idx++
    }
    // 撤销之后再操作会覆盖之后的操作
    this.queue.splice(this.idx, this.size, transaction)
  }
  redo() {
    if (this.idx === this.queue.length - 1) {
      return false
    } else {
      this.idx++
      return this.current.apply()
    }
  }
  undo() {
    if (this.idx === -1) {
      return false
    } else {
      const res = this.current.rollback()
      this.idx--
      return res
    }
  }
}
