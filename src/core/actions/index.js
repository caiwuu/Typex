import caretMove from './caret'
import insert from './insert'
import del from './delete.js'
import fontStyle from './fontStyle'

export default function registerActions(editor) {
  // 光标移动
  editor.on('caretMove', caretMove.bind(editor))
  // 内容插入
  editor.on('insert', insert.bind(editor))
  // 删除
  editor.on('delete', del.bind(editor))
  // 字体样式
  editor.on('fontStyle', fontStyle.bind(editor))
}
