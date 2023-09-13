import { mergeTextPath } from '../utils'
class Step {
  constructor(range) {
    this.position = range.container.position
    this.offset = range.offset
    this.editor = range.editor
  }
  apply() {
    const path = this.editor.queryPath(this.position)
    const res = this.applyAction({
      path,
      offset: this.offset,
    })
    path.component.update()
    return res
  }
  invert() {
    const path = this.editor.queryPath(this.position)
    this.invertAction({
      path,
      offset: this.offset,
    })
    path.component.update()
  }
}
export class SplitText extends Step {
  constructor(path, offset) {
    super(path, offset)
  }
  applyAction(ops) {
    const res = ops.path.split(ops.offset)
    editor.selection.updatePoints(ops.path, ops.offset + 1, -ops.offset, res[1])
    return res
  }
  invertAction(ops) {
    mergeTextPath([ops.path, ops.path.nextSibling], ops.editor)
  }
}
export class SetFormats extends Step {
  constructor(path, offset, format) {
    super(path, offset)
    this.format = format
  }
  applyAction(ops) {
    this.startFormats = { ...ops.path.node.formats }
    Object.assign(ops.path.node.formats, this.format)
    this.endFormats = { ...ops.path.node.formats }
  }
  invertAction(ops) {
    ops.path.node.formats = this.startFormats
  }
}
export class DeleteText extends Step {
  constructor(path, offset, count) {
    super(path, offset)
    this.count = count
  }
  applyAction(ops) {
    this.deleteText = ops.path.node.data.slice(ops.offset - this.count, ops.offset)
    ops.path.node.data =
      ops.path.node.data.slice(0, this.offset - this.count) + ops.path.node.data.slice(this.offset)
    editor.selection.updatePoints(ops.path, ops.offset, -this.count)
  }
  invertAction(ops) {
    ops.path.node.data =
      ops.path.node.data.slice(0, ops.offset - this.count) +
      this.deleteText +
      ops.path.node.data.slice(ops.offset - this.count)
    editor.selection.updatePoints(ops.path, ops.offset - this.count, this.count)
  }
}
export class InsertText extends Step {
  constructor({ range, data }) {
    super(range)
    this.data = data
  }
  applyAction({ path, offset }) {
    const oldData = path.node.data
    path.node.data = oldData.slice(0, offset) + this.data + oldData.slice(offset)
    this.editor.selection.updatePoints(path, offset, this.data.length)
  }
  invertAction({ path, offset }) {
    path.node.data =
      path.node.data.slice(0, offset) + path.node.data.slice(offset + this.data.length)
    this.editor.selection.updatePoints(path, offset, -this.data.length)
  }
}
