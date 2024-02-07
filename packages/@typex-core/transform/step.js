import { mergeTextPath } from '../utils'

/**
 * @description 步骤类
 * @class Step
 */
class Step {
  constructor(range) {
    this.position = range.container.position
    this.offset = range.offset
    this.editor = range.editor
  }

  /**
   * @description 执行正操作
   * @returns {*}  
   * @memberof Step
   */
  apply() {
    const path = this.editor.queryPath(this.position)
    const res = this.applyAction({
      path,
      offset: this.offset,
    })
    path.component.update()
    return res
  }

  /**
   * @description 执行逆操作
   * @memberof Step
   */
  invert() {
    const path = this.editor.queryPath(this.position)
    this.invertAction({
      path,
      offset: this.offset,
    })
    path.component.update()
  }

  /**
   * @description 正操作
   * - 需要在子类中实现正操作
   * @abstract
   * @memberof Step
   */
  applyAction() {
    throw Error('Step does not implement a required interface "applyAction"')
  }

  /**
   * @description 逆操作
   * - 需要在子类中实现逆操作
   * @abstract
   * @memberof Step
   */
  invertAction() {
    throw Error('Step does not implement a required interface "invertAction"')
  }
}

/**
 * @description 文本分隔
 * @export
 * @class SplitText
 * @extends {Step}
 */
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

/**
 * @description 设置格式
 * @export
 * @class SetFormats
 * @extends {Step}
 */
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

/**
 * @description 文本删除
 * @export
 * @class TextDelete
 * @extends {Step}
 */
export class TextDelete extends Step {
  constructor({ range, count }) {
    super(range)
    this.count = count
  }
  applyAction({ path, offset }) {
    this.deleteText = path.textDelete(offset,this.count)
    editor.selection.updatePoints(path, offset, -this.count)
  }
  invertAction({ path, offset }) {
    path.textInsert(offset - this.count,this.deleteText)
    // path.node.data =
    //   path.node.data.slice(0, offset - this.count) +
    //   this.deleteText +
    //   path.node.data.slice(offset - this.count)
    editor.selection.updatePoints(path, offset - this.count, this.count)
  }
}

/**
 * @description 文本插入
 * @export
 * @class TextInsert
 * @extends {Step}
 */
export class TextInsert extends Step {
  constructor({ range, data }) {
    super(range)
    this.data = data
  }
  applyAction({ path, offset }) {
    path.textInsert(offset, this.data)
    this.editor.selection.updatePoints(path, offset, this.data.length)
  }
  invertAction({ path, offset }) {
    path.textDelete(offset + this.data.length, this.data.length)
    this.editor.selection.updatePoints(path, offset + this.data.length, -this.data.length)
  }
}
