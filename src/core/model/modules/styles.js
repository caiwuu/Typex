const emptyMap = new Map()
function updateStyles(vnode, oldVnode) {
  const elm = vnode.elm
  let oldStyles = oldVnode?.styles
  let styles = vnode?.styles

  if (!oldStyles && !styles) return
  if (oldStyles === styles) return
  oldStyles = oldStyles || emptyMap
  styles = styles || emptyMap

  styles.forEach((value, key) => {
    const cur = value
    const old = oldStyles.get(key)
    if (old !== cur) {
      elm.style.setProperty(key, cur)
    }
  })
  oldStyles.forEach((_, key) => {
    if (!styles.has(key)) {
      elm.style.removeProperty(key)
    }
  })
}

export const stylesModule = {
  create: updateStyles,
  update: updateStyles,
}
