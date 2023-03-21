import { del } from './delete'

/**
 * @description 回车操作
 * @export
 * @param {*} range
 * @param {*} event
 */
export async function enter(range, event) {
  if (!range.collapsed) {
    del(range)
  }
  const startSplits = range.container.split(range.offset)
  const cloneParent = range.container.parent.cloneMark()
  startSplits[1].moveTo(cloneParent)
  cloneParent.insertAfter(range.container.parent)
  await cloneParent.parent.component.update()
  range.set(startSplits[1], 0)
  range.collapse(true)
}
