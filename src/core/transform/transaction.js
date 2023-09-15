import { SplitText, SetFormats, DeleteText, InsertText } from './step'
export default class Transaction {
  steps = []
  startRanges = []
  endRanges = []
  commited = false
  constructor(editor) {
    this.editor = editor
    // 初始状态
    this.startRanges = this.editor.selection.rangesSnapshot
  }
  get commitPath() {
    return this.editor.queryPath(this.commitPathPosition)
  }
  addAndApplyStep(step) {
    this.steps.push(step)
    return step.apply(this.editor)
  }
  addStep(...step) {
    this.steps.push(...step)
  }
  commit() {
    if (this.steps.length === 0) return
    // 结尾状态
    this.endRanges = this.editor.selection.rangesSnapshot
    this.editor.history.push(this)
    this.commited = true
  }
  apply() {
    for (let index = 0; index < this.steps.length; index++) {
      const step = this.steps[index]
      step.apply(this.editor)
    }
    setTimeout(() => {
      this.editor.selection.recoverRangesFromSnapshot(this.endRanges)
    })
  }
  rollback() {
    for (let index = this.steps.length; index > 0; index--) {
      const step = this.steps[index - 1]
      step.invert(this.editor)
    }
    setTimeout(() => {
      this.editor.selection.recoverRangesFromSnapshot(this.startRanges)
    })
  }
}

export function setFormat(editor, format) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const commonPath = editor.queryCommonPath(range.startContainer, range.endContainer)
    const paths = getLeafPathInRange(range, editor, ts)
    for (const item of paths) {
      const setFormatStep = new SetFormats(item, 0, format)
      ts.addAndApplyStep(setFormatStep)
    }
    ts.commit(commonPath)
    commonPath.component.update()
  })
}
export function deleteText(editor, count) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const deleteTextStep = new DeleteText(range.container, range.offset, count)
    ts.addAndApplyStep(deleteTextStep)
    ts.commit(range.container.parent)
    range.container.parent.component.update()
  })
}

export function insertText(editor, data) {
  const ts = new Transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const deleteTextStep = new InsertText(range.container, range.offset, data)
    ts.addAndApplyStep(deleteTextStep)
    ts.commit(range.container.parent)
    range.container.parent.component.update()
  })
}

function getLeafPathInRange(range, editor, ts) {
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
