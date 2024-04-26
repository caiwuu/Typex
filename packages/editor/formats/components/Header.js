/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:21:40
 */
import Block from './block'
export default class Header extends Block {
  render (h) {
    // return h(`h${this.props.level}`, null, this.$path.render())
    return (
      <p>
        {this.$path.render()}
      </p>
    )
  }
}
