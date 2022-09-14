/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-14 14:34:49
 */
function insert(path, range, str) {
  const { endOffset } = range
  return {
    position: path.position,
    type: 'insert',
    op: [endOffset, str, endOffset + str.length],
  }
}
function del(path, range, str) {
  const { endOffset } = range
  return {
    position: path.position,
    type: 'del',
    op: [endOffset, str, endOffset + str.length],
  }
}
