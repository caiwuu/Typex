const emptySet = new Set()
function updateClasses(vnode, oldVnode) {
  const elm = vnode.elm
  let oldClasses = oldVnode?.classes
  let classes = vnode?.classes

  if (!oldClasses && !classes) return
  if (oldClasses === classes) return
  oldClasses = oldClasses || emptySet
  classes = classes || emptySet

  classes.forEach((value) => {
    if (!oldClasses.has(value)) {
      elm.classList.add(value)
    }
  })
  oldClasses.forEach((value) => {
    if (!classes.has(value)) {
      elm.classList.remove(key)
    }
  })
  if (!vnode.isEditable) {
    elm.classList.add('editor-disabled')
  } else {
    elm.classList.remove('editor-disabled')
  }
}

export const classesModule = {
  create: updateClasses,
  update: updateClasses,
}
