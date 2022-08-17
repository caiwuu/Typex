import { default as h } from '../view/vdom/createVnode'
import { setVnMark } from '../mappings'

class Formater {
  formatMap = new Map()
  register(format) {
    this.formatMap.set(format.name, format)
  }
  render(marks) {
    const gs = this.group(
      {
        marks: marks,
        restFormats: this.types,
      },
      0
    )
    const vn = this.generateGroups(gs)
    return vn
  }
  invokeRender(vn, current) {
    return current.fmt.render(vn, current.value, h)
  }
  mergeTextMark(marks) {
    const baseMark = marks[0]
    const marksLen = marks.length
    if (marksLen === 1) return baseMark
    const basePath = this.editor.queryPath(baseMark)
    for (let i = 0; i < marksLen - 1; i++) {
      baseMark.data += basePath.nextSibling.node.data
      basePath.nextSibling.delete()
    }
    return baseMark
  }
  generateGroups(gs) {
    return gs.map((g) => {
      let componentQuene
      const formatQuene = this.getFormats(g.commonFormats)
      // 文本格式
      if (g.commonFormats.length === 0) {
        if (g.children.findIndex((ele) => typeof ele.data === 'object') !== -1)
          throw '格式标记不合法,文本格式不可用于标记非文本的结构'
        const mergedMark = this.mergeTextMark(g.children)
        const text = h('text', {}, [mergedMark.data])
        setVnMark(mergedMark, text)
        return text

        // 组件格式
      } else if (
        (componentQuene = formatQuene.filter((ele) => ele.fmt.type === 'component')).length
      ) {
        // 组件类型单独占一个分组
        const mark = g.children[0]
        const fmt = componentQuene[0].fmt
        const pv = fmt.render(null, mark.data, h)
        // 为所有component类型的mark映射vnode
        setVnMark(mark, pv)
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
          vn.children = this.generateGroups(g.children)
        } else {
          if (g.children.findIndex((ele) => typeof ele.data === 'object') !== -1)
            throw '格式标记不合法,文本格式不可用于标记非文本的结构'
          const mergedMark = this.mergeTextMark(g.children)
          const text = h('text', {}, [mergedMark.data])
          setVnMark(mergedMark, text)
          vn.children = [text]
        }
        return pv
      }
    })
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
  canAdd(mark, prevMark, key) {
    /**
     * 当前无格式
     */
    if (!mark.formats[key]) return false
    /**
     * 当前有格式，上一个没格式
     */
    if (!prevMark.formats[key]) return true
    /**
     * 当前格式和上一个相同
     */
    if (mark.formats[key] === prevMark.formats[key]) return true
  }
  // 公共格式提取分组法
  group(group, index, r = []) {
    const grouped = { commonFormats: [], children: [] }
    let restFormats = []
    let prevMark = null
    let counter = {}
    let prevMaxCounter = 0
    for (index; index < group.marks.length; index++) {
      let cacheCounter = { ...counter }
      const mark = group.marks[index]
      group.restFormats.forEach((key) => {
        if (!prevMark) {
          counter[key] = 0
          if (mark.formats[key]) counter[key]++
        } else if (this.canAdd(mark, prevMark, key)) {
          counter[key]++
        }
      })
      const maxCounter = Math.max(...Object.values(counter))
      /**
       * 块格式 不嵌套
       */
      if (
        prevMark &&
        Object.keys(mark.formats).some((key) => ['block', 'component'].includes(this.get(key).type))
      ) {
        prevMark = null
        break
      }
      if (
        prevMark &&
        Object.keys(prevMark.formats).some((key) =>
          ['block', 'component'].includes(this.get(key).type)
        )
      ) {
        prevMark = null
        break
      }
      /**
       * 上一个是纯文本,下一个有格式
       */
      if (prevMark && prevMaxCounter === 0 && maxCounter > prevMaxCounter) {
        counter = cacheCounter
        break
      }
      /**
       * 上一个和当前比没有格式增长
       */
      if (prevMark && maxCounter === prevMaxCounter && maxCounter !== 0) {
        counter = cacheCounter
        break
      }
      // 无格式也是一个分组
      grouped.children.push(mark)
      grouped.commonFormats = Object.entries(counter)
        .filter((ele) => ele[1] && ele[1] === maxCounter)
        .map((ele) => ({ [ele[0]]: group.marks[index].formats[ele[0]] }))
      restFormats = group.restFormats.filter(
        (ele) =>
          !grouped.commonFormats.some((i) => {
            return i[ele]
          })
      )

      prevMaxCounter = maxCounter
      prevMark = mark
    }
    /**
     * 递归边界
     * 1.非空格式集长度小于1
     * 2.空格式集
     */
    if (grouped.commonFormats.length > 0 && grouped.children.length > 1) {
      grouped.children = this.group(
        {
          marks: grouped.children,
          restFormats,
        },
        0
      )
    }
    r.push(grouped)
    if (index < group.marks.length) {
      this.group(group, index, r)
    }
    return r
  }
}
export default new Formater()
