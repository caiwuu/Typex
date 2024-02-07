/*
 * @Author: caiwu
 * @Description: op 原子操作
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-15 10:55:03
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
    op: [endOffset, str, endOffset - str.length],
  }
}
