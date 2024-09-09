/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:35
 */
import { Content } from '@typex/core'
export default class Block extends Content {
  get displayType () {
    return 'block'
  }
  onKeydownb ({ event, range }) {
    keydownHandle.call(this, event, range, (path) => {
      path.node.formats.bold = !path.node.formats.bold
    })
  }
  onKeydownd ({ event, range }) {
    keydownHandle.call(this, event, range, (path) => {
      path.node.formats.deleteline = !path.node.formats.deleteline
    })
  }
  onKeydowns ({ event, range }) {
    keydownHandle.call(this, event, range, (path) => {
      path.node.formats.sup = !path.node.formats.sup
    })
  }
  onKeydownS ({ event, range }) {
    keydownHandle.call(this, event, range, (path) => {
      path.node.formats.sub = !path.node.formats.sub
    })
  }
  onKeydownu ({ event, range }) {
    keydownHandle.call(this, event, range, (path) => {
      path.node.formats.underline = !path.node.formats.underline
    })
  }
}
function keydownHandle (event, range, callback) {
  if (event?.ctrlKey) {
    event?.preventDefault?.()
    this.setFormat(range, callback)
  }
}
