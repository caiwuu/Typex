/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-31 17:13:41
 */
import { createPath, queryCommonPath, queryPath, Formater, Content, Path } from './model'
import Selection from './selection'
import { createRef, createVnode, patch, Component } from './view'
import { SplitText } from './transform/step'
import { setFormat, deleteText } from './transform/transaction'
import * as utils from './utils.js'
import {
  setVdomOrElm,
  setVnodeOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVnodeOrIns,
} from './mappings'
const core = {
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
  setVnodeOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVnodeOrIns,
  SplitText
}

export default core


window.setFormat = setFormat
window.deleteText = deleteText