/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-25 13:30:39
 */
import emit from 'mitt'
import mount from './mount'
import { Selection, registerActions, queryPath, createPath } from '@/core'
import formater from './formats'
import { mockData } from './data'
class Editor {
  ui = {
    body: null,
  }
  constructor(options) {
    this.init(options)
  }
  init(options) {
    formater.inject('editor', this)
    this.$path = options.path
    this.$emitter = emit()
    this.selection = new Selection(this)
    registerActions(this)
  }
  mount(id) {
    mount.call(this, id)
  }
  on(eventName, fn) {
    this.$emitter.on(eventName, fn)
  }
  emit(eventName, args) {
    this.$emitter.emit(eventName, args)
  }
  focus() {
    this.$emitter.emit('focus')
  }
  queryPath(elm, offset = 0) {
    return queryPath(elm, this.$path, offset)
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
  console.log(path)
  return new Editor({ path })
}
