/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-11 15:03:52
 */
import './style.styl'
import { createVnode as h, patch } from '@/core'
import ColorPicker from './colorPicker'
setTimeout(() => {
  patch(test(h), document.getElementById('components-test'))
  function test () {
    return <ColorPicker color='red'></ColorPicker>
  }
}, 500)
