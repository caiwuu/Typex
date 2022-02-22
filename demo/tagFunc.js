// function getPersonInfo(strs, ...exprs) {
//   console.log(strs)
//   console.log(exprs)
//   const style = exprs.reduce((result, expr, index) => {
//     const isFunc = typeof expr === 'function'
//     const value = isFunc ? expr(1) : expr

//     return result + value + strs[index + 1]
//   }, strs[0])
//   console.log(style)
// }
// let height = 20
// const primaryColor = 'coral'
// getPersonInfo`
//   background: ${(primary) => (primary ? 'white ' : primaryColor)};
//   color: ${({ primary }) => (primary ? primaryColor : 'white')};
//   padding: 0.25rem 1rem;
//   border: solid 2px ${primaryColor};
//   border-radius: 3px;
//   margin: 0.5rem;
// `

class Interval {
  style = {
    color: '',
    fontFamily: '',
    fontSize: '',
    bold: false,
    italic: false,
    underLine: false,
    delete: false,
    background: '#fff',
  }
  start = 0
  end = 0
  constructor(start, end) {
    this.start = start
    this.end = end
  }
  setRange(start, end) {
    this.start = start
    this.end = end
  }
  clone() {
    const clone = new Interval()
    clone.style = { ...this.style }
    return clone
  }
}
class Con {
  link = []
  interval = []
  constructor(con) {
    this.con = con
  }
  fork(count) {
    let start = 0
    if (this.link.length) {
      start = this.link[this.link.length - 1].end
    }
    this.link.push({ start, end: count + start, content: this.con.slice(start, count + start) })
  }
}
const con = new Con('1234567890')
con.fork(3)
con.fork(4)
console.log(con.link)
