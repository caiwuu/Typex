export { default as createElement } from './createElement'
export { default as Component } from './component/component'
export { patch, createElm, updateChildren } from './patch'
export { mount } from './mount'
export { default as transfer } from './transfer'
export const createRef = () => {
  return { current: null }
}
