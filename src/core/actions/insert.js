/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-19 12:02:27
 */
import { getVnOrElm, getVnOrPath } from '../mappings'
export default function insert({ range, data }) {
  const { startOffset: pos, startContainer: node } = range
  const path = getVnOrPath(getVnOrElm(node))
  if (path) {
    // let path = this.queryPath(mark)
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
