import { createElement as h, mount } from '../core'
import ColorPicker from './colorPicker'
mount(test(), document.getElementById('components-test'))

function test() {
  return <ColorPicker color='rgb(30,59,11,0.2)'></ColorPicker>
}
