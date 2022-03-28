import { getLayer } from '../share/utils'
import { patch, transfer } from '../index'
export default function fontStyle(args) {
  const [type, value] = args
  console.log(type, value)
  textParse(this.selection, type, value)
}
// mark 测试demo 可行性验证
function textParse(selection, type, value) {
  const range = selection.getRangeAt(0)
  transEveryBlock('startVNode', range, selection, type)
  // transEveryBlock('endVNode', range, selection, type)
}
function transEveryBlock(key, range, selection, type) {
  console.log(range[key])
  const blockVnode = getLayer(range[key])
  if (!range) return
  if (range.collapsed) {
    return
  }
  transfer(blockVnode, range)
    .toMarks((args) => {
      console.log(args)
      args.forEach((ele) => {
        if (ele.selected) {
          ele.mark[type] = !ele.mark[type]
        }
      })
    })
    .toJson((json) => {
      console.log(json)
    })
    .toVNode((chs) => {
      const clonedVnode = blockVnode.clone()
      clonedVnode.children = chs
      patch(clonedVnode, blockVnode)
      selection.drawRangeBg()
    })
}
