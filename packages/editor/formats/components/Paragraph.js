/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:21:40
 */
import Block from './block'
import Static from './Static'
export default class Paragraph extends Block {
  render () {
    return (
      <p>
        {/* <Static> */}
        {/* <div>
            <span style='background:#ddd'>静态内容 不可编辑 不可选中 它是组件的一部分</span>
          </div> */}
        {/* <div> */}
        {/* <span style='background:#ddd'>只有通过formater.render的内容才能被编辑</span> */}
        {/* </div> */}
        {/* </Static> */}
        {/* <editor-content> */}
        {this.$path.render()}
        {/* </editor-content> */}
      </p>
    )
  }
  onMounted () {
    console.log('Paragraph  onMounted');
  }
  onCreated () {
    console.log('Paragraph  onCreated');
  }
  onUnmounted () {
    console.log('Paragraph onUnmounted');
  }
}
