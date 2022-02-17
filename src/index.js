import { creatElement as h, render } from './core/model'
const vn = h(
    'div',
    {
        class: 'caiwu www', style: "color:red;background:cyan;fontSize:30px"
    },
    ["this is a text"])
console.log(vn);
render(vn, document.getElementById('editor-root'))
