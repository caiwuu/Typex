/*
 * @Description:
 * @Author: caiwu
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:20:35
 */
import { Content } from '@/core'
export default class Block extends Content {
  get displayType() {
    return 'block'
  }
  onKeydownb(range, event) {
    if (event?.ctrlKey) {
      event?.preventDefault?.()
      this.setFormat(range, (path) => {
        path.node.formats.bold = !path.node.formats.bold
      })
    }
  }
  onKeydownd(range, event) {
    if (event?.ctrlKey) {
      event?.preventDefault?.()
      this.setFormat(range, (path) => {
        path.node.formats.deleteline = !path.node.formats.deleteline
      })
    }
  }
  onKeydowns(range, event) {
    if (event?.ctrlKey) {
      event?.preventDefault?.()
      this.setFormat(range, (path) => {
        if (event.shiftKey) {
          path.node.formats.sub = !path.node.formats.sub
        } else {
          path.node.formats.sup = !path.node.formats.sup
        }
      })
    }
  }
  onKeydownu(range, event) {
    if (event?.ctrlKey) {
      event?.preventDefault?.()
      this.setFormat(range, (path) => {
        path.node.formats.underline = !path.node.formats.underline
      })
    }
  }
}
