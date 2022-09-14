/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-14 16:15:36
 */
const reverseOpMap = {
  insert: 'del',
  del: 'insert',
}
export default class History {
  size = 50
  queue = []
  current = -1
  editor = null
  constructor(size, editor) {
    this.size = size
    this.editor = editor
  }
  push(ops) {
    if (this.queue.length === this.size) {
      this.queue.shift()
    }
    this.current++
    // 撤销之后再操作会覆盖之后的操作
    this.queue.splice(this.current, this.size, ops)
  }
  todo() {
    if (this.current === this.queue.length - 1) {
      return false
    } else {
      this.current++
      return this.queue[this.current]
    }
  }
  undo() {
    if (this.current === 0) {
      return false
    } else {
      this.current--
      return this.genReverseOp(this.queue[this.current])
    }
  }
  // 生成逆操作
  genReverseOp(ops) {
    return [...ops].reverse().map((op) => ({
      position: op.position,
      type: reverseOpMap[op.type],
      op: [...op.op].reverse(),
    }))
  }
}
