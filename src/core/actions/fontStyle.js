import { getLayer } from '../share/utils'
import { patch, transfer } from '../index'
export default function fontStyle(args) {
  const [type, value] = args
  console.log(type, value)
  textParse(this.selection.getRangeAt(0), this.selection, type, value)
}
// mark 测试demo 可行性验证
function textParse(range, selection, type, value) {
  if (!range) return
  if (range.collapsed) {
    return
  }
  let parentNode = null
  const sbn = getLayer(range.startVNode)
  const ebn = getLayer(range.endVNode)
  parentNode = sbn
  transfer(parentNode, range)
    .toMarks((args) => {
      console.log(args)
      args.forEach((ele, index) => {
        if (ele.selected) {
          console.log(ele)
          ele.mark[type] = !ele.mark[type]
        }
      })
    })
    .toJson((json) => {
      console.log(json)
    })
    .toVNode((chs) => {
      const pVnode = parentNode.clone()
      pVnode.children = chs
      patch(pVnode, parentNode)
      selection.drawRangeBg()
    })
}
