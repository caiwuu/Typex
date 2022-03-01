import caretMove from './caret'
import insert from './insert'

export default function registerActions(editor) {
  // 光标移动
  editor.on('caretMove', caretMove.bind(editor))
  // 内容插入
  editor.on('insert', insert.bind(editor))
}
