/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 10:58:19
 */
import { getVnOrElm, getVnOrMark } from '../mappings'
export default function insert({ range, data }) {
  const { startOffset: pos, startContainer: node } = range
  const mark = getVnOrMark(getVnOrElm(node))
  if (mark) {
    let path = this.queryPath(mark)
    if (path.node.type !== 'text') {
      path = path.firstLeaf
    }
    const component = path.parent.component
    path.node.data = path.node.data.slice(0, pos) + data + path.node.data.slice(pos)
    component.updateState(this, path).then(() => {
      range.setStart(path, range.startOffset + data.length)
      range.collapse(true)
      range.updateCaret()
    })
  } else {
    console.error('mark查找失败')
  }
}
