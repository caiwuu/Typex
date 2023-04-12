import { mergeTextPath } from '../utils'
class Step {
  constructor(path, offset) {
    this.position = path.position
    this.offset = offset
  }
  apply(editor) {
    const path = editor.queryPath(this.position)
    console.log(path === editor.$path.children[0].children[1])
    return this.applyAction({
      editor,
      path,
      offset: this.offset,
    })
  }
  invert(editor) {
    const path = editor.queryPath(this.position)
    this.invertAction({
      editor,
      path,
      offset: this.offset,
    })
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
