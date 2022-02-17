export default class Vnode {
  attrs = {}
  data = {}
  static = true
  position = '0'
  path = []
  index = 0
  parentNode = null
  _isVnode = true
  ele = null
  isRoot = true
  tagName = null
  type = 'node'
  children = []
  styles = []
  classes = []
  listeners = null
  insert (vnode, index) {
    console.log('insert')
    index = index === undefined ? this.length : index
    if (this.children.length > index) {
      if (index === 0) {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[0])
      } else {
        this.ele.insertBefore(vnode.ele, this.ele.childNodes[index - 1].nextSibling)
      }
    } else {
      this.ele.appendChild(vnode.ele)
    }
    this.children.splice(index, 0, vnode)
    this.reArrangement()
  }
  repalce () {
    console.log('replace')
  }
  delete (index, count) {
    console.log('delete')
    const start = index - count <= 0 ? 0 : index - count
    this.children.splice(start, index - start).forEach((vnode) => vnode.ele.remove())
    this.reArrangement()
  }
  moveTo (target, index) {
    console.log('moveTo')
    const removeNodes = this.parentNode.children.splice(this.index, 1)
    this.parentNode.reArrangement()
    removeNodes.forEach((vnode) => {
      target.insert(vnode, index)
    })
  }
  remove () {
    console.log('remove')
    this.parentNode.children.splice(this.index, 1).forEach((i) => {
      i.removed = true
      i.ele.remove()
    })
    this.reArrangement(this.parentNode)
  }
  reArrangement () {
    if (this.children) {
      this.children.forEach((item, index) => {
        const oldPosition = item.position
        item.index = index
        item.parentNode = this
        item.position = this.position + '-' + index
        if (oldPosition !== item.position) item.reArrangement()
      })
    }
  }
  appendChild (...vnodes) {
    vnodes && this.children.push(...vnodes)
    this.reArrangement()
  }
  get isEmpty () {
    if (this.children && this.children.length) {
      return vnode.children.every((item) => this.isEmpty(item))
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
      return this.children.filter((ele) => ele.type !== 'placeholder').length
    }
  }
  render () {
    const dom = document.createElement(this.tagName)
    // set style
    this.styles.forEach((value, key) => {
      dom.style[key] = value
    })
    // set class
    this.classes.forEach((className) => {
      dom.classList.add(className)
    })
    return dom
  }
}
