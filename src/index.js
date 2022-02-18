import { createElement as h, render, Component } from './core/model'
import { Paragraph, ChildParagraph } from './components/index'
// const vn = h(
//   'div',
//   {
//     class: 'caiwu www',
//     style: 'color:red;background:#eee;fontSize:12px',
//   },
//   [('this is a text', h('ul', [h('li', 'list')]), h(Paragraph, { age: 12, child: () => [1, 2, 3].map((e) => h('span', e)) }))]
// )

const vn = h(Paragraph, { age: 12, child: () => [1, 2, 3].map((e) => h('span', e)) })
console.log(vn)
render(vn, document.getElementById('editor-root'))
