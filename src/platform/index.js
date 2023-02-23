import * as web from './web'
import context from './context'
const platform = {
  ...web,
}

platform.install = (plugins, core) => {
  context.core = core
  plugins.platform = web
  return platform.initIntercept
}

// const Caret = platform.Caret
// const nativeDocument = platform.nativeDocument
// const nativeWindow = platform.nativeWindow
// const nativeSelection = platform.nativeSelection
// const insertBefore = platform.insertBefore
// const replaceChild = platform.replaceChild
// const appendChild = platform.appendChild
// const removeChild = platform.removeChild
// const domToVNode = platform.domToVNode
// const createElm = platform.createElm
// const initIntercept = platform.initIntercept
// const updateProps = platform.updateProps

// export {
//   Caret,
//   nativeDocument,
//   nativeWindow,
//   nativeSelection,
//   insertBefore,
//   replaceChild,
//   appendChild,
//   removeChild,
//   domToVNode,
//   createElm,
//   initIntercept,
//   updateProps,
// }
export default platform
