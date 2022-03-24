import { getLayer } from '../share/utils'
import { patch, transfer } from '../index'
export default function fontStyle(args) {
  const [type, value] = args
  console.log(type, value)
  textParse(this.selection.getRangeAt(0), this.selection, type, value)
}
function rangeTrack() {}
// mark 测试demo 可行性验证
function textParse(range, selection, type, value) {
  if (!range) return
  if (range.collapsed) {
    return
  } else {
    if (range.endVNode.type === 'text') {
      range.endVNode.splitNode(range.endOffset)
      range.endVNode._context += '_$END$_'
    }
    if (range.startVNode.type === 'text') {
      range.startVNode.splitNode(range.startOffset)
      range.startVNode._context += '_$START$_'
    }
  }
  let parentNode = null
  const sbn = getLayer(range.startVNode)
  const ebn = getLayer(range.endVNode)
  if (sbn === ebn) {
    parentNode = sbn
    transfer(parentNode)
      .toMarks((args) => {
        let startIdx = null
        let endIdx = 100000
        args.forEach((ele, index) => {
          if (/_\$START\$_/.test(ele.content._context)) {
            startIdx = index
          }
          if (/_\$END\$_/.test(ele.content._context)) {
            endIdx = index
          }
          if (startIdx !== null && startIdx < index && index <= endIdx) {
            console.log(startIdx, index, endIdx)
            args[index].mark[type] = true
          }
        })
      })
      .toJson((args) => {
        console.log(args)
        return args
      })
      .toVNode((chs, R) => {
        const pVnode = parentNode.clone()
        pVnode.children = chs
        pVnode.reArrangement()
        console.log(R)

        patch(pVnode, parentNode)
        range.setStart(R[0], R[0].length)
        range.setEnd(R[1], R[1].length)
        console.log(range)
        selection.drawRangeBg()
      })
  }
}
