export { default as createElement } from './createElement'
export { default as Component } from './component'
export { render } from './render'
export { renderDom } from './render'
export { default as transfer } from './transfer'
export const createRef = () => {
  return { current: null }
}
