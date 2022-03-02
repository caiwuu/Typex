import { getCommonAncestorNode, deleteNode, getLayer, recoverRangePoint, isEmptyBlock, comparePosition } from '../share/utils'
import { getPrev, getNext } from './caret'
import { createElement } from '../model'
export default function del(args) {
  const [from, to] = transToNode.call(this, args)
  const prev = getPrevPoint(from.node, from.pos)
  if (typeof to === 'number') {
    // 行内操作
    if (prev.flag <= 0) {
      console.log('节点内删除')
      innerDel.call(this, from, to, prev)
      // 需要跨标签操作
    } else {
      console.log('跨节点删除')
      crossNodeDel.call(this, from, to, prev)
    }
  } else {
    // 区间删除
    if (from.node === to.node) {
      innerDel.call(this, from, from.pos - to.pos, { node: from.node, pos: to.pos })
    } else {
      const commonAncestorContainer = getCommonAncestorNode(this.ui.editableArea.vnode, from, to)
      console.log(commonAncestorContainer)
      rangeDel.call(this, commonAncestorContainer, to, from, prev)
    }
  }
}
/**
 * 单点删除
 */
// 节点内删除
function innerDel(from, to, prev) {
  // 重新计算受影响的range端点
  // 先移动range在执行删除
  const points = this.selection
    .getRangePoints()
    .filter((point) => point.container === from.node.ele && point.offset >= from.pos)
    .map((point) => ({
      container: point.offset === from.pos ? prev.node.ele : point.container,
      offset: point.offset === from.pos ? prev.pos : prev.flag === -2 ? point.offset - to - 1 : point.offset - to,
      range: point.range,
      flag: point.flag,
    }))
  const isEmpty = isEmptyBlock(from.node)
  recoverRangePoint(points)
  from.node.delete(from.pos, prev.flag === -2 ? to + 1 : to, true)
  isEmpty && del.call(this, [prev, 1])
  // 添加br防止行塌陷
  if (isEmptyBlock(from.node)) {
    const brContainer = from.node.type === 'text' ? from.node.parent : from.node
    console.log(brContainer.childrens)
    console.log(brContainer.childrens.some((vnode) => vnode.belong('placeholder')))
    const brPos = from.node.type === 'text' ? from.node.index + 1 : from.pos
    if (!brContainer.childrens.some((vnode) => vnode.belong('placeholder'))) {
      console.log('添加br')
      const br = createVnode({ type: 'br', kind: 'placeholder' })
      brContainer.insert(br, brPos)
    }
  }
}
function clearBlock(block) {
  block.childrens.slice(0).forEach((node) => {
    node.remove()
  })
}
// 跨节点
function crossNodeDel(from, to, prev) {
  // 首行删除
  // 404 没有找到前位点
  if (prev.flag === 404) {
    console.log('404')
    const block = getLayer(from.node)
    let points = this.selection.getRangePoints().filter((point) => point.container === from.node.ele)
    // 段落为空则初始化段落
    if (block.isEmpty) {
      clearBlock(block)
      const br = createVnode({ type: 'br', kind: 'placeholder' })
      block.insert(br, 1)
      points = points.map((point) => ({
        container: block.ele,
        offset: 0,
        range: point.range,
        flag: point.flag,
      }))
    } else if (from.node.isEmpty) {
      const next = getNextPoint(from.node, from.pos)
      points = points.map((point) => ({
        container: next.node.ele,
        offset: 0,
        range: point.range,
        flag: point.flag,
      }))
      deleteNode(from.node)
    }
    recoverRangePoint(points)
    return
  }
  // 重新计算受影响的range端点
  // 先移动range在执行删除
  const prevIsEmpty = isEmptyBlock(prev.node)
  console.log(prevIsEmpty)
  const points = this.selection
    .getRangePoints()
    .filter((point) => point.container === from.node.ele && point.offset === from.pos)
    .map((point) => {
      return {
        container: prevIsEmpty ? point.container : prev.node.ele,
        offset: prevIsEmpty ? point.offset : prev.pos,
        range: point.range,
        flag: point.flag,
      }
    })
  recoverRangePoint(points)
  // 跨节点自动执行一步删除
  const toBlock = getLayer(prev.node)
  if (prev.flag === 1) {
    console.log('自动执行一步删除')
    const from = {
      node: prev.node,
      pos: prev.pos,
    }
    del.call(this, [prev, 1])
    // 如果当前节点为空则递归向上删除空节点
    from.node.isEmpty && prev.flag === 2 && deleteNode(from.node)
  } else if (prevIsEmpty) {
    toBlock.remove()
  } else if (isEmptyBlock(from.node)) {
    deleteNode(from.node)
  } else {
    // 合并块
    console.log('合并块', to)
    const fromBlock = getLayer(from.node)
    fromBlock.childrens.slice(0).forEach((node, index) => {
      node.moveTo(toBlock, prev.pos + index)
    })
    fromBlock.remove()
  }
  this.selection.nativeSelection.removeAllRanges()
}

function compareStart(vnode, startPos, endPos, samebranch = false) {
  const compareRes = comparePosition(vnode.position, startPos)
  if (compareRes === 0 && vnode.position !== startPos) {
    for (let index = vnode.childrens.length - 1; index >= 0; index--) {
      const element = vnode.childrens[index]
      compareStart(element, startPos, endPos, true)
    }
  } else if (compareRes == -1) {
    if (samebranch) {
      deleteNode(vnode)
    } else {
      compareEnd(vnode, endPos, false)
    }
  }
}
function compareEnd(vnode, endPos) {
  const compareRes = comparePosition(vnode.position, endPos)
  if (compareRes === 0 && vnode.position !== endPos) {
    for (let index = vnode.childrens.length - 1; index >= 0; index--) {
      const element = vnode.childrens[index]
      compareEnd(element, endPos)
    }
  } else if (compareRes == 1) {
    deleteNode(vnode)
  }
}
// 选区删除，删除两个节点之间的节点
export function rangeDel(commonAncestorContainer, to, from) {
  const startPos = to.node.position
  const endPos = from.node.position
  // 先删除开始到结束之间的节点
  for (let index = commonAncestorContainer.childrens.length - 1; index >= 0; index--) {
    const element = commonAncestorContainer.childrens[index]
    compareStart(element, startPos, endPos)
  }
  // 再删除开始节点和结束节点选中的内容
  let curr = { node: from.node, pos: from.pos }
  while (curr.node !== to.node || curr.pos !== to.pos) {
    const prev = getPrevPoint(curr.node, curr.pos)
    del.call(this, [curr, 1])
    curr = prev
  }
}
