/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:12:53
 */
import mount from './mount'
import { createPath, Typex,utils } from '@typex/core'
import platform from '@typex/platform'
import formats from './formats'
import { mockData } from './data'

class Editor extends Typex {
  conamndHandles = {}
  toolBarOption = []
  constructor(options) {
    super({
      formats,
      plugins: [platform],
      ...options,
    })
    this.on('command', this.command)
  }
  mount(id) {
    mount.call(this, id)
    return this
  }
  setToolBar(toolBarOption) {
    this.toolBarOption = toolBarOption
    toolBarOption.forEach((toolItem) => {
      toolItem.editor = this
      this.conamndHandles[toolItem.commandName] = toolItem.commandHandle
    })
    return this
  }
  command(name,val) {
    const commandHandle = this.conamndHandles[name]
    console.log(commandHandle);
    if (typeof commandHandle !== 'function') return
    commandHandle(this,val)
  }
}
export default function createEditor(options = {}) {
  const marks = mockData
  const path = createPath(marks)
  return new Editor({ path })
}
