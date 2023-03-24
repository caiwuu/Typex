/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:13:41
 */
import { usePlugin } from './pluginContext'
import initCore from './initCore'
import core from './core'

const createPath = core.createPath,
  queryCommonPath = core.queryCommonPath,
  queryPath = core.queryPath,
  Formater = core.Formater,
  Content = core.Content,
  Block = core.Block,
  Path = core.Path,
  Selection = core.Selection,
  createRef = core.createRef,
  createVnode = core.createVnode,
  patch = core.patch,
  Component = core.Component,
  insertedInsQueue = core.insertedInsQueue,
  utils = core.utils,
  setVnElm = core.setVnElm,
  setVnIns = core.setVnIns,
  setVnPath = core.setVnPath,
  getVnOrElm = core.getVnOrElm,
  getVnOrPath = core.getVnOrPath,
  getVnOrIns = core.getVnOrIns

export {
  createPath,
  queryCommonPath,
  queryPath,
  Formater,
  Content,
  Block,
  Path,
  Selection,
  createRef,
  createVnode,
  patch,
  Component,
  insertedInsQueue,
  utils,
  setVnElm,
  setVnIns,
  setVnPath,
  getVnOrElm,
  getVnOrPath,
  getVnOrIns,
  usePlugin,
  initCore,
}
