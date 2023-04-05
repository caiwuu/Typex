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
import * as utils from './utils.js'
import {
  setVdomOrElm,
  setVdomOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVdomOrIns,
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
  setVdomOrIns,
  setVdomOrPath,
  getVdomOrElm,
  getVdomOrPath,
  getVdomOrIns,
}

export default core
