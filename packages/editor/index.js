/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:12:53
 */
import mount from './mount'
import { createPath, Typex, utils } from '@typex/core'
import platform from '@typex/platform'
import formats from './formats'
import { mockData } from './data'
import toolBarOptions from './toolBar/toolBarOptions'

class Editor extends Typex {
  conamndHandles = {}
  toolBarOptions = toolBarOptions
  constructor(options) {
    super({
      formats,
      plugins: [platform],
      ...options,
    })
    this.on('command', this.command)
    this.setToolBar(toolBarOptions)
  }
  mount (id) {
    mount.call(this, id)
    return this
  }
  setToolBar (options) {
    if (!toolBarOptions || utils.typeOf(toolBarOptions) !== "array") {
      throw new Error('setToolBar 必须提供一个数组类型的参数')
    }
    this.conamndHandles = {}
    this.toolBarOptions = toolBarOptions.filter(e => options.includes(e.name))
    this.toolBarOptions.forEach((toolItem) => {
      toolItem.editor = this
      this.conamndHandles[toolItem.name] = toolItem.commandHandle
    })
    return this
  }
  command (name, val) {
    const commandHandle = this.conamndHandles[name]
    if (typeof commandHandle !== 'function') return
    commandHandle(this, val)
  }
}
export default function createEditor (options = {}) {
  const marks = mockData
  const path = createPath(marks)
  return new Editor({ path })
}
