import { SplitText, SetFormats, TextDelete, TextInsert } from './step'


/**
 * @description 事务类
 * @export
 * @class Transaction
 */
export default class Transaction {

  /**
   * @description 步骤列表
   * @memberof Transaction
   */
  steps = []

  /**
   * @description 保存事务初始化时的选区快照
   * @memberof Transaction
   */
  startRanges = []

  /**
   * @description 事务提交之后的选区快照
   * @memberof Transaction
   */
  endRanges = []

  /**
   * @description 是否提交标志
   * @memberof Transaction
   */
  commited = false

  constructor(editor) {
    this.editor = editor
    this.init()
  }

  /**
   * @description 初始化开始状态
   * @memberof Transaction
   */
  init () {
    // 初始状态
    this.startRanges = this.editor.selection.rangesSnapshot
  }

  /**
   * @description 增加并且执行动作
   * @param {*} step
   * @returns {*}  
   * @memberof Transaction
   */
  addAndApplyStep (step) {
    this.steps.push(step)
    return step.apply(this.editor)
  }

  /**
   * @description 增加动作
   * @param {*} step
   * @memberof Transaction
   */
  addStep (...step) {
    this.steps.push(...step)
  }

  /**
   * @description 提交事务
   * @returns {*}  
   * @memberof Transaction
   */
  commit () {
    if (this.steps.length === 0) return this
    // 结尾状态
    this.endRanges = this.editor.selection.rangesSnapshot
    this.editor.history.push(this)
    this.commited = true
  }

  /**
   * @description 执行事务
   * @memberof Transaction
   */
  apply () {
    for (let index = 0; index < this.steps.length; index++) {
      const step = this.steps[index]
      step.apply(this.editor)
    }
    setTimeout(() => {
      this.editor.selection.recoverRangesFromSnapshot(this.endRanges)
    })
  }

  /**
   * @description 回滚事务
   * @memberof Transaction
   */
  rollback () {
    for (let index = this.steps.length; index > 0; index--) {
      const step = this.steps[index - 1]
      step.invert(this.editor)
    }
    setTimeout(() => {
      this.editor.selection.recoverRangesFromSnapshot(this.startRanges)
    })
  }
}

export function setFormat (editor, format) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const commonPath = range.startContainer.queryCommonPath(range.endContainer)
    const paths = getLeafPathInRange(range, editor, ts)
    for (const item of paths) {
      const setFormatStep = new SetFormats(item, 0, format)
      ts.addAndApplyStep(setFormatStep)
    }
    ts.commit(commonPath)
    commonPath.currentComponent.update()
  })
}
export function deleteText (editor, count) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const deleteTextStep = new TextDelete(range.container, range.offset, count)
    ts.addAndApplyStep(deleteTextStep)
    ts.commit(range.container.parent)
    range.container.parent.currentComponent.update()
  })
}

export function insertText (editor, data) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const deleteTextStep = new TextInsert(range.container, range.offset, data)
    ts.addAndApplyStep(deleteTextStep)
    ts.commit(range.container.parent)
    range.container.parent.currentComponent.update()
  })
}

function getLeafPathInRange (range, editor, ts) {
  if (range.collapsed) return []
  let start,
    end,
    value,
    done = false
  if (range.collapsed) {
    done = true
  } else {
    if (range.startOffset === 0) {
      start = range.startContainer
    } else if (range.startOffset === range.startContainer.length) {
      start = range.startContainer.nextLeaf
    } else {
      const splitTextStep = new SplitText(range.startContainer, range.startOffset)
      const startSplits = ts.addAndApplyStep(splitTextStep)
      start = startSplits[1]
    }

    if (range.endOffset === 0) {
      end = range.endContainer.prevLeaf
    } else if (range.endOffset === range.endContainer.length) {
      end = range.endContainer
    } else {
      const splitTextStep = new SplitText(range.endContainer, range.endOffset)
      const endSplits = ts.addAndApplyStep(splitTextStep)
      end = endSplits[0]
    }
  }

  value = start
  return {
    length: 0,
    next: function () {
      if (!done) {
        const res = { value, done }
        done = value === end
        value = value.nextLeaf
        this.length++
        return res
      } else {
        return { value: undefined, done }
      }
    },
    [Symbol.iterator]: function () {
      return this
    },
  }
}
