import { SplitText, SetFormats, DeleteText } from './step'
class transaction {
  steps = []
  startRanges = []
  endRanges = []
  constructor(editor) {
    this.editor = editor
    // 初始状态
    this.startRanges = this.editor.selection.stringifyRanges()
  }
  get commitPath () {
    return this.editor.queryPath(this.commitPathPosition)
  }
  addAndApplyStep (step) {
    this.steps.push(step)
    return step.apply(this.editor)
  }
  commit (path) {
    // 结尾状态
    this.endRanges = this.editor.selection.stringifyRanges()
    this.commitPathPosition = path.position
    path.component.update()
    this.editor.history.push(this)
  }
  apply () {
    for (let index = 0; index < this.steps.length; index++) {
      const step = this.steps[index]
      step.apply(this.editor)
    }
    this.commitPath.component.update().then(() => {
      this.editor.selection.recoverRangesFromJson(this.endRanges)
    })
  }
  rollback () {
    for (let index = this.steps.length; index > 0; index--) {
      const step = this.steps[index - 1]
      step.invert(this.editor)
    }
    this.commitPath.component.update().then(() => {
      this.editor.selection.recoverRangesFromJson(this.startRanges)
    })
  }
}

export function setFormat (editor, format) {
  const ts = new transaction(editor)
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
export function deleteText (editor, count) {
  const ts = new transaction(editor)
  editor.selection.ranges.forEach((range) => {
    const deleteTextStep = new DeleteText(range.container, range.offset, count)
    ts.addAndApplyStep(deleteTextStep)
    ts.commit(range.container.parent)
    range.container.parent.component.update()
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
    } else if (range.startOffset === range.startContainer.len) {
      start = range.startContainer.nextLeaf
    } else {
      const splitTextStep = new SplitText(range.startContainer, range.startOffset)
      const startSplits = ts.addAndApplyStep(splitTextStep)
      start = startSplits[1]
    }

    if (range.endOffset === 0) {
      end = range.endContainer.prevLeaf
    } else if (range.endOffset === range.endContainer.len) {
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
