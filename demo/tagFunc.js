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
// const testArr = ['name', 'caiwu']
// const test2 = [['name', 'caiwu']]
// const test = new Map([['name', 'caiwu']])
// // console.log(test)
// for (let key,value of test) {
//   console.log(key,value)
// }
var fn = {
  name: 'test',
  on (a) {
    return a
  }
}
var a = (0, fn.on)(function () {
  console.log(this);
})
