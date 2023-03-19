import { default as h } from '../view/vdom/createVnode'
import { setVnPath } from '../mappings'


/**
 * @description 格式管理类
 * @class Formater
 */
class Formater {
  formatMap = new Map()

  /**
   * @description 注册格式
   * @param {*} format
   * @memberof Formater
   */
  register (format) {
    this.formatMap.set(format.name, format)
  }

  /**
   * @description 依赖注入
   * @param {*} propName
   * @param {*} prop
   * @memberof Formater
   */
  inject (propName, prop) {
    this[propName] = prop
  }

  /**
   * @description path 渲染
   * @param {*} path
   * @returns {*}  
   * @memberof Formater
   */
  render (path) {
    const gs = this._group(
      {
        paths: path.children,
        restFormats: this.types,
      },
      0
    )
    const vn = this._generateGroups(gs, path.len)
    return vn
  }

  /**
   * @description 渲染调用
   * @param {*} vn
   * @param {*} current
   * @returns {*}  
   * @memberof Formater
   */
  _invokeRender (vn, current) {
    return current.fmt.render(vn, current.value, h)
  }

  /**
   * @description 合并选区断点容器
   * @param {*} path
   * @param {*} basePath
   * @memberof Formater
   */
  mergePointsContainer (path, basePath) {
    this.editor.selection.rangePoints
      .filter((point) => point.container === path)
      .forEach((point) => {
        if (point.pointName === 'start') {
          point.range.setStart(basePath, basePath.len + point.offset)
        } else {
          point.range.setEnd(basePath, basePath.len + point.offset)
        }
      })
  }

  /**
   * @description 文本路径合并
   * @param {*} paths
   * @returns {*}  
   * @memberof Formater
   */
  _mergeTextPath (paths) {
    const basePath = paths[0]
    const pathsLen = paths.length
    if (pathsLen === 1) return basePath
    for (let i = 0; i < pathsLen - 1; i++) {
      // 对在该节点的选区断点进行合并到basePath
      this.mergePointsContainer(basePath.nextSibling, basePath)
      basePath.node.data += basePath.nextSibling.node.data
      basePath.nextSibling.delete()
    }
    return basePath
  }

  /**
   * @description 格式分组
   * @param {*} gs
   * @param {*} flag
   * @returns {*}  
   * @memberof Formater
   */
  _generateGroups (gs, flag) {
    return gs
      .map((g) => {
        let componentQuene
        const formatQuene = this._getFormats(g.commonFormats)
        // 无格式
        if (g.commonFormats.length === 0) {
          if (g.children.findIndex((path) => typeof path.node.data === 'object') !== -1)
            throw '格式标记不合法,文本格式不可用于标记非文本的结构'
          const mergedTextPath = this._mergeTextPath(g.children)
          let vtext
          if (mergedTextPath.node.data === '') {
            vtext = flag === 0 ? h('br') : null
            /* 
             这里借助指针的思想，设计比较巧妙抽象
             改变path指向，从path层面看选区还在path-0位置
             表现层因为text-0已经不存在了；需要添加br防止块塌陷，光标应该聚焦在父级-0
             表现层看来这里产生了混乱，不符合编程直觉；从更加抽象的path层面看是统一的；
             */

            // 内容为空时 将path指向他父级的vdom
            setVnPath(mergedTextPath, mergedTextPath.parent.vn)
            mergedTextPath.clearFormat()
          } else {
            // 输入内容时 重新指向创建vdom
            vtext = h('text', {}, [mergedTextPath.node.data])
            setVnPath(mergedTextPath, vtext)
          }
          return vtext

          // 有格式
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
            vn = this._invokeRender(vn, current)
            if (!pv) pv = vn
          }
          // 处理属性格式
          // 如果存在属性格式（vn）应该加在标签上面
          // 如果不存在属性格式（vn）则创建一个span
          for (let index = 0; index < attributeQueue.length; index++) {
            const current = attributeQueue[index]
            const res = this._invokeRender(vn, current)
            if (res) vn = res
            if (!pv) pv = res
          }
          if (g.children[0].commonFormats) {
            vn.children = this._generateGroups(g.children, flag)
          } else {
            if (g.children.findIndex((ele) => typeof ele.data === 'object') !== -1)
              throw '格式标记不合法,文本格式不可用于标记非文本的结构'
            const mergedTextPath = this._mergeTextPath(g.children)
            let vtext = null
            if (flag === 0) {
              vtext = h('br')
              setVnPath(mergedTextPath, vn)
              mergedTextPath.clearFormat()
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

  /**
   * @description 获取格式类型list
   * @readonly
   * @memberof Formater
   */
  get types () {
    return [...this.formatMap.keys()]
  }
  _getFormats (objs) {
    return objs.map((obj) => {
      const key = Object.keys(obj)[0]
      return {
        fmt: this.formatMap.get(key),
        value: obj[key],
      }
    })
  }

  /**
   * @description 根据格式名获取格式
   * @param {*} key
   * @returns {*}  
   * @memberof Formater
   */
  get (key) {
    return this.formatMap.get(key) || {}
  }

  /**
   * @description 判断是否可以增加
   * @param {*} path
   * @param {*} prevPath
   * @param {*} key
   * @returns {*}  {boolean}
   * @memberof Formater
   */
  _canAdd (path, prevPath, key) {
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

  /**
   * @description 公共格式提取分组法
   * @param {*} _group
   * @param {*} index
   * @param {*} [r=[]]
   * @returns {*}  
   * @memberof Formater
   */
  _group (_group, index, r = []) {
    const grouped = { commonFormats: [], children: [] }
    let restFormats = []
    let prevPath = null
    let counter = {}
    let prevMaxCounter = 0
    for (index; index < _group.paths.length; index++) {
      let cacheCounter = { ...counter }
      const path = _group.paths[index]
      _group.restFormats.forEach((key) => {
        if (!prevPath) {
          counter[key] = 0
          if (path.node.formats[key]) counter[key]++
        } else if (this._canAdd(path, prevPath, key)) {
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
        .map((ele) => ({ [ele[0]]: _group.paths[index].node.formats[ele[0]] }))
      restFormats = _group.restFormats.filter(
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
      grouped.children = this._group(
        {
          paths: grouped.children,
          restFormats,
        },
        0
      )
    }
    r.push(grouped)
    if (index < _group.paths.length) {
      this._group(_group, index, r)
    }
    return r
  }
}
export default Formater
