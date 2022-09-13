function insert(range, str) {
  const { startOffset, startContainer } = range
  return {
    type: 'insert',
    op: [startOffset, str, startOffset + str.length],
  }
}
