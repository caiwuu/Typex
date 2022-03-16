export { default as createElement } from './createElement'
export { default as Component } from './component'
export { patch, createElm } from './patch'
export { render } from './render'
export { default as transfer } from './transfer'
export const createRef = () => {
  return { current: null }
}
