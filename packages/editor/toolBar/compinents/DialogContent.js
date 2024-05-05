import { Component } from '@typex/core'
import ColorPicker from './colorPicker'
const headerOps = [
  [1, "H1"],
  [2, "H2"],
  [3, "H3"],
  [4, "H4"],
  [5, "H5"],
  [6, "H6"],
]
function headerClickHandle (e, vm) {
  const val = e.target.dataset.headervalue
  if (val) {
    vm.props.onOk(val)
  }
}
const comMap = {
  fontColor: (h, self) => (
    <div id="colorPicker">
      <ColorPicker onOk={self.props.onOk} color='#666666'></ColorPicker>
    </div>
  ),
  header: (h, self) => {
    return <div onClick={(e) => headerClickHandle(e, self)} style="color:#666">
      {
        // headerOps.map(ele => <div data-headervalue={ele[0]}>{ele[1]}</div>)
        headerOps.map(ele => h(ele[1], { "data-headervalue": ele[0], style: { margin: '2px 0' }, class: 'header-selector-item' }, [ele[1]]))
      }
    </div>
  }
}
export class DialogContent extends Component {
  constructor(props) {
    super(props)
  }
  render (h) {
    return comMap[this.props.name]?.(h, this) || <span>404</span>
  }
}


