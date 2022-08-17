import * as web from './web'
const platform = web

const Caret = platform.Caret
const nativeDocument = platform.nativeDocument
const nativeWindow = platform.nativeWindow
const nativeSelection = platform.nativeSelection
const insertBefore = platform.insertBefore
const replaceChild = platform.replaceChild
const appendChild = platform.appendChild
const removeChild = platform.removeChild
const domToVNode = platform.domToVNode
const createElm = platform.createElm
const initIntercept = platform.initIntercept
const updateProps = platform.updateProps

export {
  Caret,
  nativeDocument,
  nativeWindow,
  nativeSelection,
  insertBefore,
  replaceChild,
  appendChild,
  removeChild,
  domToVNode,
  createElm,
  initIntercept,
  updateProps,
}
