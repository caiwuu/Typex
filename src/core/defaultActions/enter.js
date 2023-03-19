import { del } from './delete'


/**
 * @description 回车操作
 * @export
 * @param {*} range
 * @param {*} event
 */
export function enter (range, event) {
    if (!range.collapsed) {
        del(range)
    }
}