import { attributesModule } from './modules/attributes'
import { listenersModule } from './modules/listeners'
import { classesModule } from './modules/classes'
import { stylesModule } from './modules/styles'
import coreContext from '../../coreContext'
/**
 * @desc: 更新dom属性
 * @param {*} vnode
 * @param {*} oldVnode
 * @return {*}
 */
export default function updateProps (vnode, oldVnode) {
  if (typeof vnode.tag === 'function') return
  const elm = coreContext.core.getVdomOrElm(vnode)
  if (vnode.tag === 'text') {
    if (vnode.children !== oldVnode.children) {
      elm.data = vnode.children
    }
  } else {
    stylesModule.update(elm, vnode, oldVnode)
    classesModule.update(elm, vnode, oldVnode)
    listenersModule.update(elm, vnode, oldVnode)
    attributesModule.update(elm, vnode, oldVnode)
  }
}
