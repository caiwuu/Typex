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
  Path = core.Path,
  Selection = core.Selection,
  createRef = core.createRef,
  createVnode = core.createVnode,
  patch = core.patch,
  Component = core.Component,
  utils = core.utils,
  setVdomOrElm = core.setVdomOrElm,
  setVdomOrIns = core.setVdomOrIns,
  setVdomOrPath = core.setVdomOrPath,
  getVdomOrElm = core.getVdomOrElm,
  getVdomOrPath = core.getVdomOrPath,
  getVdomOrIns = core.getVdomOrIns

export {
  createPath,
  queryCommonPath,
  queryPath,
  Formater,
  Content,
  Path,
  Selection,
  createRef,
  createVnode,
  patch,
  Component,
  utils,
  setVdomOrElm,
  setVdomOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVdomOrIns,
  usePlugin,
  initCore,
}
