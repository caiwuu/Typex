/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-22 10:20:15
 */
function updateClasses(elm, vnode, oldVnode) {
  const className = (vnode?.props.class || '').trim()
  if (className) elm.className = className
  let oClasses, nclasses
  const oClassName = (oldVnode?.props.class || '').trim()
  const nClassName = (vnode?.props.class || '').trim()

  if (!oClassName && !nClassName) return
  if (oClassName === nClassName) return
  oClasses = new Set(oClassName ? oClassName.split(/\s+/g) : [])
  nclasses = new Set(nClassName ? nClassName.split(/\s+/g) : [])

  nclasses.forEach((value) => {
    if (!oClasses.has(value)) {
      elm.classList.add(value)
    }
  })
  oClasses.forEach((value) => {
    if (!nclasses.has(value)) {
      elm.classList.remove(key)
    }
  })
}

export const classesModule = {
  create: updateClasses,
  update: updateClasses,
}
