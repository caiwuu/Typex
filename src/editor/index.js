/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:12:53
 */
import mount from './mount'
import { queryPath, queryCommonPath, createPath, initCore } from '@/core'
import platform from '@/platform'
import formater from './formats'
import { mockData } from './data'
class Editor {
  ui = {
    body: null,
  }
  conamndHandles = {}
  toolBarOption = []
  constructor(options) {
    this.$path = options.path
    initCore({
      editor: this,
      formater,
      platform,
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
      this.conamndHandles[toolItem.command] = toolItem.commandHandle
    })
    return this
  }
  command(name) {
    const commandHandle = this.conamndHandles[name]
    if (typeof commandHandle !== 'function') return
    this.selection.ranges.forEach((range) => {
      const path = range.container
      path.component.setFormat(range, commandHandle)
    })
    Promise.resolve().then(() => {
      this.selection.updateCaret()
    })
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
  queryPath(v) {
    return queryPath(v, this.$path)
  }
  queryCommonPath(v1, v2) {
    const path1 = this.queryPath(v1)
    const path2 = this.queryPath(v2)
    return queryCommonPath(path1, path2)
  }
}
function initMarks(data) {
  // return {
  //   data: {
  //     marks: [
  //       {
  //         data: {
  //           marks: [
  //             {
  //               data: {
  //                 marks: [{ data, formats: { color: 'green', fontSize: '22px', del: true } }],
  //               },
  //               formats: { paragraph: true },
  //             },
  //           ],
  //         },
  //         formats: { root: true },
  //       },
  //     ],
  //   },
  // }
  return {
    data: {
      marks: [
        {
          data: {
            marks: [
              {
                data,
                formats: { color: 'green', fontSize: '22px', del: true },
              },
              {
                data: {
                  src: 'https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
                  alt: 'test image',
                  width: '50px',
                  height: '50px',
                },
                formats: { image: true },
              },
            ],
          },
          formats: { paragraph: true },
        },
      ],
    },
    formats: { root: true },
  }
}
export default function createEditor(options = {}) {
  // const marks = initMarks(options.data)
  const marks = mockData
  const path = createPath(marks)
  return new Editor({ path })
}
