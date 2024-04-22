/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-09-23 10:55:36
 */

/**
 * @description 删除操作
 * @export
 * @param {*} range
 * @param {boolean} [force=false]
 */
export function del ({ event, range, ts, force = false }) {
  if (range.inputState.isComposing && !force) return
  const { endContainer, startContainer } = range
  let commonPath = startContainer.queryCommonPath(endContainer)
  const currentComponent = commonPath.currentComponent
  currentComponent.onContentDelete({ event, range, ts })
}
