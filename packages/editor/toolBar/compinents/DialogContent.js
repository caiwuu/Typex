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
const fontSizeOps = [10, 11, 12, 14, 16, 18, 20, 24, 36, 48, 60]
function headerClickHandle (e, vm) {
  const val = e.target.dataset.headervalue
  if (val) {
    vm.props.onOk(+val)
  }
}
const comMap = {
  color: (h, self) => (
    <div id="colorPicker">
      <ColorPicker onOk={self.props.onOk} color={self.props.value}></ColorPicker>
    </div>
  ),
  background: (h, self) => (
    <div id="colorPicker">
      <ColorPicker onOk={self.props.onOk} color={self.props.value}></ColorPicker>
    </div>
  ),
  header: (h, self) => {
    return <div onClick={(e) => headerClickHandle(e, self)} style="color:#666">
      {
        headerOps.map(ele => h(ele[1], { "data-headervalue": ele[0], style: { margin: '2px 8px' }, class: `header-selector-item ${self.props.value === ele[0] ? 'active' : ''}` }, [ele[1]]))
      }
    </div>
  },
  fontSize: (h, self) => {
    return <div onClick={(e) => headerClickHandle(e, self)} style="color:#666">
      {
        fontSizeOps.map(ele => h('div', { "data-headervalue": ele, style: { margin: '2px 8px' }, class: `header-selector-item ${self.props.value === ele + 'px' ? 'active' : ''}` }, [ele]))
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


