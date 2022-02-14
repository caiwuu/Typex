function loader(source) {
  console.log(source)
  let reg = /url\((.+?)\)/g
  let current
  let pos = 0
  let arr = [`let lists = [];`]
  while ((current = reg.exec(source))) {
    let [matchUrl, p] = current
    let index = reg.lastIndex - matchUrl.length
    arr.push(`lists.push(${JSON.stringify(source.slice(pos, index))})`)
    pos = reg.lastIndex
    arr.push(`lists.push("url("+require(${p})+")")`)
  }
  arr.push(`lists.push(${JSON.stringify(source.slice(pos))})`)
  arr.push(`module.exports = lists.join('')`)
  return arr.join('\r\n')
}
module.exports = loader
