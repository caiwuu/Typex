import { default as h } from '../view/vdom/createVnode'
import { setVnPath } from '../mappings'

class Formater {
  formatMap = new Map()
  register(format) {
    this.formatMap.set(format.name, format)
  }
  inject(propName, prop) {
    this[propName] = prop
  }
  render(path) {
    const gs = this.group(
      {
        paths: path.children,
        restFormats: this.types,
      },
      0
    )
    const vn = this.generateGroups(gs, path.len)
    return vn
  }
  invokeRender(vn, current) {
    return current.fmt.render(vn, current.value, h)
  }
  mergeTextPath(paths) {
    const basePath = paths[0]
    const pathsLen = paths.length
    if (pathsLen === 1) return basePath
    for (let i = 0; i < pathsLen - 1; i++) {
      basePath.node.data += basePath.nextSibling.node.data
      basePath.nextSibling.delete()
    }
    return basePath
  }
  generateGroups(gs, flag) {
    return gs
      .map((g) => {
        let componentQuene
        const formatQuene = this.getFormats(g.commonFormats)
        // 文本格式
        if (g.commonFormats.length === 0) {
          if (g.children.findIndex((path) => typeof path.node.data === 'object') !== -1)
            throw '格式标记不合法,文本格式不可用于标记非文本的结构'
          const mergedTextPath = this.mergeTextPath(g.children)
          let vtext
          if (mergedTextPath.node.data === '') {
            vtext = flag === 0 ? h('br') : null
            // 这里比较绕，设计比较巧妙抽象
            // 改变path指向，从path层面看选区还在path-0位置
            // 表现层因为text-0已经不存在了；需要添加br防止块塌陷，光标应该聚焦在父级-0
            // 表现层看来这里产生了混乱，不符合编程直觉；从更加抽象的path层面看是统一的；
            setVnPath(mergedTextPath, mergedTextPath.parent.vn)
          } else {
            vtext = h('text', {}, [mergedTextPath.node.data])
            setVnPath(mergedTextPath, vtext)
          }
          return vtext

          // 组件格式
        } else if (
          (componentQuene = formatQuene.filter((ele) => ele.fmt.type === 'component')).length
        ) {
          // 组件类型单独占一个分组
          const path = g.children[0]
          const fmt = componentQuene[0].fmt
          const pv = fmt.render(null, { path, editor: this.editor }, h)
          // 为所有component类型的path映射vnode
          setVnPath(path, pv)
          return pv

          // 属性和标签格式
        } else {
          let pv = null // 最外层的vnode
          let vn = null // 当前vnode
          const attributeQueue = []
          for (let index = 0; index < formatQuene.length; index++) {
            const current = formatQuene[index]
            // 属性类型的格式放在最后处理
            if (current.fmt.type === 'attribute') {
              attributeQueue.push(current)
              continue
            }
            // 处理标签格式 嵌套处理
            vn = this.invokeRender(vn, current)
            if (!pv) pv = vn
          }
          // 处理属性格式
          // 如果存在属性格式（vn）应该加在标签上面
          // 如果不存在属性格式（vn）则创建一个span
          for (let index = 0; index < attributeQueue.length; index++) {
            const current = attributeQueue[index]
            const res = this.invokeRender(vn, current)
            if (res) vn = res
            if (!pv) pv = res
          }
          if (g.children[0].commonFormats) {
            vn.children = this.generateGroups(g.children, flag)
          } else {
            if (g.children.findIndex((ele) => typeof ele.data === 'object') !== -1)
              throw '格式标记不合法,文本格式不可用于标记非文本的结构'
            const mergedTextPath = this.mergeTextPath(g.children)
            let vtext = null
            if (flag === 0) {
              vtext = h('br')
              setVnPath(mergedTextPath, vn)
            } else {
              vtext = h('text', {}, [mergedTextPath.node.data])
              setVnPath(mergedTextPath, vtext)
            }
            vn.children = [vtext]
          }
          return pv
        }
      })
      .filter((i) => i)
  }
  get types() {
    return [...this.formatMap.keys()]
  }
  getFormats(objs) {
    return objs.map((obj) => {
      const key = Object.keys(obj)[0]
      return {
        fmt: this.formatMap.get(key),
        value: obj[key],
      }
    })
  }
  get(key) {
    return this.formatMap.get(key) || {}
  }
  canAdd(path, prevPath, key) {
    /**
     * 当前无格式
     */
    if (!path.node.formats[key]) return false
    /**
     * 当前有格式，上一个没格式
     */
    if (!prevPath.node.formats[key]) return true
    /**
     * 当前格式和上一个相同
     */
    if (prevPath.node.formats[key] === path.node.formats[key]) return true
  }
  // 公共格式提取分组法
  group(group, index, r = []) {
    const grouped = { commonFormats: [], children: [] }
    let restFormats = []
    let prevPath = null
    let counter = {}
    let prevMaxCounter = 0
    for (index; index < group.paths.length; index++) {
      let cacheCounter = { ...counter }
      const path = group.paths[index]
      group.restFormats.forEach((key) => {
        if (!prevPath) {
          counter[key] = 0
          if (path.node.formats[key]) counter[key]++
        } else if (this.canAdd(path, prevPath, key)) {
          counter[key]++
        }
      })
      const maxCounter = Math.max(...Object.values(counter))
      /**
       * 块格式 不嵌套
       */
      if (
        prevPath &&
        Object.keys(path.node.formats).some((key) =>
          ['block', 'component'].includes(this.get(key).type)
        )
      ) {
        prevPath = null
        break
      }
      if (
        prevPath &&
        Object.keys(prevPath.node.formats).some((key) =>
          ['block', 'component'].includes(this.get(key).type)
        )
      ) {
        prevPath = null
        break
      }
      /**
       * 上一个是纯文本,下一个有格式
       */
      if (prevPath && prevMaxCounter === 0 && maxCounter > prevMaxCounter) {
        counter = cacheCounter
        break
      }
      /**
       * 上一个和当前比没有格式增长
       */
      if (prevPath && maxCounter === prevMaxCounter && maxCounter !== 0) {
        counter = cacheCounter
        break
      }
      // 无格式也是一个分组
      grouped.children.push(path)
      grouped.commonFormats = Object.entries(counter)
        .filter((ele) => ele[1] && ele[1] === maxCounter)
        .map((ele) => ({ [ele[0]]: group.paths[index].node.formats[ele[0]] }))
      restFormats = group.restFormats.filter(
        (ele) =>
          !grouped.commonFormats.some((i) => {
            return i[ele]
          })
      )

      prevMaxCounter = maxCounter
      prevPath = path
    }
    /**
     * 递归边界
     * 1.非空格式集长度小于1
     * 2.空格式集
     */
    if (grouped.commonFormats.length > 0 && grouped.children.length > 1) {
      grouped.children = this.group(
        {
          paths: grouped.children,
          restFormats,
        },
        0
      )
    }
    r.push(grouped)
    if (index < group.paths.length) {
      this.group(group, index, r)
    }
    return r
  }
}
export default Formater
