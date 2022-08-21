/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 14:35:22
 */
import { Content } from '@/core'
export default class Image extends Content {
  render() {
    console.log(this)
    return <img onClick={this.sizeChange} {...this.state.path.node.data}></img>
  }
  sizeChange = () => {
    if (this.state.path.node.data.width === '50px') {
      this.state.path.node.data.width = '200px'
      this.state.path.node.data.height = '200px'
      this.setState()
    } else {
      this.state.path.node.data.width = '50px'
      this.state.path.node.data.height = '50px'
      this.setState()
    }
  }
  onCaretEnter(path, range, isStart) {
    range.setStart(path.parent, path.index + isStart ? 0 : 1)
  }
  /**
   * 箭头左动作
   * @param {*} path 路径
   * @param {*} range 区间
   * @param {*} editor 编辑器
   * @memberof Content
   */
  // onArrowLeft(path, range) {
  //   console.log(path, range)
  //   range.setStart(path.parent, 0)
  // }
  // onArrowLeft(path, range) {
  //   console.log(path, range)
  //   range.setStart(path.parent, 0)
  // }
  get contentLength() {
    return 1
  }
}
