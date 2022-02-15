export class Vnode {
  position = '0'
  path = []
  index = 0
  parentNode = null
  _isVnode = true
  ele = null
  isRoot = true
  tagName = null
  type = null
  childrens = null
  styles = []
  classes = []
  listeners = null
  insert (vnode, index) {
    console.log('insert')
    index = index === undefined ? this.length : index
    if (this.childrens.length > index) {
      if (index === 0) {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[0])
      } else {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[index - 1].nextSibling)
      }
    } else {
      this.ele.appendChild(vnode.ele)
    }
    this.childrens.splice(index, 0, vnode)
    this.reArrangement()
  }
  repalce () {
    console.log('replace')
  }
  delete (index, count) {
    console.log('delete')
    const start = index - count <= 0 ? 0 : index - count
    this.childrens.splice(start, index - start).forEach((vnode) => vnode.ele.remove())
    this.reArrangement()
  }
  moveTo (target, index) {
    console.log('moveTo')
    const removeNodes = this.parentNode.childrens.splice(this.index, 1)
    this.parentNode.reArrangement()
    removeNodes.forEach((vnode) => {
      target.insert(vnode, index)
    })
  }
  remove () {
    console.log('remove')
    this.parentNode.childrens.splice(this.index, 1).forEach((i) => {
      i.removed = true
      i.ele.remove()
    })
    this.reArrangement(this.parentNode)
  }
  reArrangement () {
    console.log('reArrangement')
    if (this.childrens) {
      this.childrens.forEach((item, index) => {
        const old = item.position
        item.index = index
        item.parent = this
        item.position = this.position + '-' + index
        if (old !== item.position) this.reArrangement(item)
      })
    }
  }
  appendChild (vnode) {
    this.childrens.push(vnode)
  }
  get isEmpty () {
    if (this.childrens && this.childrens.length) {
      return vnode.childrens.every((item) => this.isEmpty(item))
    } else {
      if (this.type === 'placeholder') {
        return true
      } else if (this.type === 'atom') {
        return false
      } else {
        return true
      }
    }
  }
  get length () {
    console.log('length')
    if (this.type === 'atom') {
      return -1
    } else {
      return this.childrens.filter((ele) => ele.type !== 'placeholder').length
    }
  }
}