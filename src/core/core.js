/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:13:41
 */
import { createPath, queryCommonPath, queryPath, Formater, Content, Path, Block } from './model'
import Selection from './selection'
import { createRef, createVnode, patch, Component, insertedInsQueue } from './view'
import * as utils from './utils.js'
import { setVnElm, setVnIns, setVnPath, getVnOrElm, getVnOrPath, getVnOrIns } from './mappings'
const core = {
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
}

export default core
