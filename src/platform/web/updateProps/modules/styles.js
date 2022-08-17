const emptyMap = {}
function updatestyle(elm,vnode, oldVnode) {
  let oldstyle = oldVnode?.props.style
  let style = vnode?.props.style

  if (!oldstyle && !style) return
  if (oldstyle === style) return
  oldstyle = oldstyle || emptyMap
  style = style || emptyMap
  Object.keys(oldstyle).forEach((key) => {
    if (!style[key]) {
      elm.style.removeProperty(key)
    }
  })
  Object.assign(elm.style, style);
}

export const stylesModule = {
  create: updatestyle,
  update: updatestyle,
}
