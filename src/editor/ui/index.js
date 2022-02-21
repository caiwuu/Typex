import { createElement as h, render, Component } from '../../core/model'
class Wrappe extends Component {
  render(h) {
    return h('div', { style: 'border:2px solid #ded;background:#eee;padding:6px' }, this.props.children)
  }
}

render(h(Wrappe, 1111), document.getElementById('editor-root'))
// class UI {
//     constructor()
// }
