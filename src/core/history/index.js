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
  current = -1
  editor = null
  constructor(size, editor) {
    this.size = size
    this.editor = editor
  }
  push(transaction) {
    if (this.queue.length === this.size) {
      this.queue.shift()
    }
    this.current++
    // 撤销之后再操作会覆盖之后的操作
    this.queue.splice(this.current, this.size, transaction)
  }
  todo() {
    if (this.current === this.queue.length - 1) {
      return false
    } else {
      this.current++
      return this.queue[this.current].apply()
    }
  }
  undo() {
    if (this.current === -1) {
      return false
    } else {
      const res = this.queue[this.current].rollback()
      this.current--
      return res
    }
  }
}
