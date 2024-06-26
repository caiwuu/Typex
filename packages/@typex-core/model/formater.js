import { default as h } from '../view/vdom/createVnode'
import { setVdomOrPath } from '../mappings'
import { mergeTextPath } from '../utils'

/**
 * @description 格式管理类
 * @class Formater
 */
class Formater {
  formatMap = new Map()

  /**
   * @description 注册格式
   * @param {*} formats
   * @memberof Formater
   */
  register (formats) {
    formats.forEach((format) => {
      this.formatMap.set(format.name, format)
    })
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
  renderRoot (rootPath) {
    return this.render({ children: [rootPath] })
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
    const vn = this._generateGroups(gs, path.isBlock && path.length === 0)
    return vn
  }

  /**
   * @description 渲染调用
   * @param {*} vn
   * @param {*} current
   * @returns {*}
   * @memberof Formater
   */
  _invokeRender (current, pv, ...others) {
    const fmt = current.fmt
    if (typeof fmt.nativeRender === 'function') {
      return fmt.nativeRender(pv, current.value, ...others, h)
    }
    const vn = fmt.render(current.value, ...others, h)
    if (!pv) return vn
    switch (fmt.type) {
      case "component":
      case "tag": {
        pv.children.push(vn)
        return vn
      }
      case 'attribute': {
        const attrNameArr = (fmt.attrName || `style.${fmt.name}`).split('.')
        attrNameArr.reduce((init, currProp, index) => {
          if (index === attrNameArr.length - 1) {
            init[currProp] = current.value
          } else {
            if (!init[currProp]) init[currProp] = {}
            return init[currProp]
          }
        }, pv.props)
        return undefined
      }
    }
  }

  /**
   * @description 格式分组
   * @param {*} gs
   * @param {*} isEmptyBlock
   * @returns {*}
   * @memberof Formater
   */
  _generateGroups (gs, isEmptyBlock) {
    return gs
      .map((g) => {
        let componentQuene
        const formatQuene = this._getFormats(g.commonFormats)
        // 无格式
        if (g.commonFormats.length === 0) {
          if (g.children.findIndex((path) => typeof path.node.data === 'object') !== -1)
            throw '格式标记不合法,文本格式不可用于标记非文本的结构'
          const mergedTextPath = mergeTextPath(g.children, this.editor)
          let vtext = null
          if (isEmptyBlock) {
            vtext = h('br')
            /* 
             这里借助指针的思想，设计比较巧妙抽象
             改变path指向，从path层面看选区还在path-0位置
             表现层因为text-0已经不存在了；需要添加br防止块塌陷，光标应该聚焦在父级-0
             表现层看来这里产生了混乱，不符合编程直觉；从更加抽象的path层面看是统一的；
             */

            setVdomOrPath(mergedTextPath, mergedTextPath.parent.vn)
            mergedTextPath.clearFormat()
          } else {
            if (mergedTextPath.node.data === '') console.warn('非法空标签：', mergedTextPath)
            // 输入内容时 重新指向创建vdom
            vtext = h('text', {}, [mergedTextPath.node.data])
            setVdomOrPath(mergedTextPath, vtext)
          }
          return vtext

          // 有格式
        } else if (
          (componentQuene = formatQuene.filter((ele) => ele.fmt.type === 'component')).length
        ) {
          // 组件类型单独占一个分组
          const path = g.children[0]
          const current = componentQuene[0]
          const pv = this._invokeRender(current, null, { path, editor: this.editor })
          // 为所有component类型的path映射vnode
          setVdomOrPath(path, pv)
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
            vn = this._invokeRender(current, vn)
            if (!pv) pv = vn
          }
          // 处理属性格式
          // 如果存在属性格式（vn）应该加在标签上面
          // 如果不存在属性格式（vn）则创建一个span
          for (let index = 0; index < attributeQueue.length; index++) {
            const current = attributeQueue[index]
            const res = this._invokeRender(current, vn)
            if (res) vn = res
            if (!pv) pv = res
          }
          if (g.children[0].commonFormats) {
            vn.children = this._generateGroups(g.children, isEmptyBlock)
          } else {
            if (g.children.findIndex((ele) => typeof ele.data === 'object') !== -1)
              throw '格式标记不合法,文本格式不可用于标记非文本的结构'
            const mergedTextPath = mergeTextPath(g.children, this.editor)
            let vtext = null
            if (isEmptyBlock) {
              vtext = h('br')
              setVdomOrPath(mergedTextPath, vn)
              mergedTextPath.clearFormat()
            } else {
              if (mergedTextPath.node.data === '') console.warn('非法空标签：', mergedTextPath)
              vtext = h('text', {}, [mergedTextPath.node.data])
              setVdomOrPath(mergedTextPath, vtext)
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

  /**
   * @description _getFormats
   * @param {*} objs
   * @returns {*}
   * @memberof Formater
   * @private
   */
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
   * @private
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
   * @param {*} group
   * @param {*} index
   * @param {*} [r=[]]
   * @returns {*}
   * @memberof Formater
   * @private
   */
  _group (group, index, r = []) {
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
        Object.keys(path.node.formats).some((key) => this.get(key).type === 'component')
      ) {
        prevPath = null
        break
      }
      if (
        prevPath &&
        Object.keys(prevPath.node.formats).some((key) => this.get(key).type === 'component')
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
      grouped.children = this._group(
        {
          paths: grouped.children,
          restFormats,
        },
        0
      )
    }
    r.push(grouped)
    if (index < group.paths.length) {
      this._group(group, index, r)
    }
    return r
  }
}
export default Formater
