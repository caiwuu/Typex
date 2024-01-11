import { classCheck } from './utils'
import { queryPath } from './model'
import { createRef } from '@/core/view'
import initCore from './initCore'
const abstractMethod = ['mount']
export default class Typex {
  contentRef = createRef()
  renderContent() {
    return (
      <div id='editor-content' style='position:relative' ref={this.contentRef}>
        {this.renderPath()}
      </div>
    )
  }
  constructor(options) {
    classCheck(new.target, Typex, abstractMethod)
    this.$path = options.path
    options.path._editor = this
    initCore({
      editor: this,
      formats: options.formats,
      plugins: options.plugins,
    })
  }
  renderPath() {
    return this.formater.render({ children: [this.$path] })
  }
  on(eventName, fn) {
    this.$eventBus.on(eventName, fn)
  }
  emit(eventName, args) {
    this.$eventBus.emit(eventName, args)
  }
  focus(range) {
    this.$eventBus.emit('focus', range)
  }
  destroy() {
    this.$eventBus.emit('destroy')
  }

  /**
   * @description 查询path
   * @param {vdom|elm|position|path} v
   * @returns {path}  
   * @memberof Typex
   */
  queryPath(v) {
    return queryPath(v, this.$path)
  }
  
  /**
   * @description 查询两个path的共同path
   * @param {vdom|elm|position|path} v1
   * @param {vdom|elm|position|path} v2
   * @returns {path}  
   * @memberof Typex
   */
  queryCommonPath(v1, v2) {
    const path1 = this.queryPath(v1)
    const path2 = this.queryPath(v2)
    return path1.queryCommonPath(path2)
  }
}
