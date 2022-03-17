export function Editable(h, props) {
  const { children } = props
  children.forEach((vn) => {
    travel(vn)
  })
  return h(children)
}
function travel(vnode) {
  if (vnode.editable !== 'off') {
    vnode.editable = 'on'
    if (vnode.children) {
      vnode.children.forEach((vn) => travel(vn))
    }
  }
}
