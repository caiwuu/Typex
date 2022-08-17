const emptySet = []
function updateClasses(elm, vnode, oldVnode) {
  const className = (vnode?.props.class || '').trim()
  if (className) elm.className = className
  // let oldClasses , classes;
  // const oClassName = (oldVnode?.props.class || '').trim()
  // const nClassName = (vnode?.props.class || '').trim()

  // if (!oClassName && !nClassName) return
  // if (oClassName === nClassName) return
  // oldClasses = new Set(oClassName ? oClassName.split(/\s+/g) : [])
  // classes = new Set(nClassName ? nClassName.split(/\s+/g) : [])

  // classes.forEach((value) => {
  //   if (!oldClasses.has(value)) {
  //     elm.classList.add(value)
  //   }
  // })
  // oldClasses.forEach((value) => {
  //   if (!classes.has(value)) {
  //     elm.classList.remove(key)
  //   }
  // })
}

export const classesModule = {
  create: updateClasses,
  update: updateClasses,
}
