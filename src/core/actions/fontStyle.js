import { getLayer, getCommonAncestorNode } from '../share/utils'
import { patch, transfer } from '../index'
export default function fontStyle(args) {
  this.focus()
  const [type, value] = args
  // console.log(type, value)
  textParse(this.selection, type, value)
}
// mark 测试demo 可行性验证
function textParse(selection, type, value) {
  const range = selection.getRangeAt(0)
  const startBlockVnode = getLayer(range.startVNode)
  const endBlockVnode = getLayer(range.endVNode)
  if (startBlockVnode === endBlockVnode) {
    transEveryBlock(endBlockVnode, range, selection, type)
  } else {
    const commonNode = getCommonAncestorNode(startBlockVnode, endBlockVnode)
    commonNode.children.forEach((ele) => {
      if (
        ele.position >= startBlockVnode.position &&
        ele.position <= endBlockVnode.position &&
        ele.type === 'block'
      ) {
        transEveryBlock(ele, range, selection, type)
      }
    })
  }
}
function transEveryBlock(blockVnode, range, selection, type) {
  if (!range) return
  if (range.collapsed) {
    return
  }
  transfer(blockVnode, range)
    .toMarks((args) => {
      // console.log(args)
      args.forEach((ele) => {
        if (ele.selected) {
          ele.mark[type] = !ele.mark[type]
        }
      })
    })
    .toJson((json) => {
      // console.log(json)
    })
    .toVNode((chs) => {
      const clonedVnode = blockVnode.clone()
      clonedVnode.children = chs
      patch(clonedVnode, blockVnode)
      selection.drawRangeBg()
    })
}
