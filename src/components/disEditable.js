export function Diseditable(h, props) {
  const { children } = props
  children.forEach((vn) => {
    travel(vn)
  })
  return h(children)
}
function travel(vnode) {
  if (vnode.editable !== 'on') {
    vnode.editable = 'off'
    if (vnode.children) {
      vnode.children.forEach((vn) => travel(vn))
    }
  }
}
