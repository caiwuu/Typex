
const toolBarOptions = [
    {
        tooltip: '撤销',
        name: 'undo',
        icon: '#icon-undo',
        commandHandle: (editor) => {
            editor.history.undo()
        }
    },
    {
        tooltip: '重做',
        name: 'redo',
        icon: '#icon-todo',
        commandHandle: (editor) => {
            editor.history.redo()
        }
    },
    {
        tooltip: '标题',
        name: 'header',
        icon: '#icon-header',
        showDialog: true,
        commandHandle: (editor, level) => setComponent(editor, path => {
            path.node.formats = { header: level }
        })
    },
    {
        tooltip: '字体大小',
        name: 'fontSize',
        icon: '#icon-font-size',
        showDialog: true,
        commandHandle: (editor, fontSize) => setFormat(editor, path => (path.node.formats.fontSize = `${fontSize}px`))
    },
    {
        tooltip: '字体颜色',
        name: 'color',
        icon: '#icon-color',
        showDialog: true,
        commandHandle: (editor, { R, G, B, A }) => setFormat(editor, path => (path.node.formats.color = `rgba(${R},${G},${B},${A})`)),
    },
    {
        tooltip: '加粗',
        name: 'bold',
        icon: '#icon-bold',
        commandHandle: (editor) => setFormat(editor, path => (path.node.formats.bold = !path.node.formats.bold)),
    },
    {
        tooltip: '下划线',
        name: 'underline',
        icon: '#icon-underline',
        commandHandle: (editor) => setFormat(editor, path => (path.node.formats.underline = !path.node.formats.underline)),
    },
    {
        tooltip: '删除线',
        name: 'deleteline',
        icon: '#icon-del',
        commandHandle: (editor) => setFormat(editor, path => (path.node.formats.deleteline = !path.node.formats.deleteline)),
    },
    {
        tooltip: '背景填充',
        name: 'background',
        icon: '#icon-fill',
        showDialog: true,
        commandHandle: (editor, { R, G, B, A }) => setFormat(editor, path => (path.node.formats.background = `rgba(${R},${G},${B},${A})`)),
    },
    {
        tooltip: '左对齐',
        name: 'leftAligned',
        icon: '#icon-align-left',
    },
    {
        tooltip: '居中',
        name: 'middleAligned',
        icon: '#icon-align-middle',
    },
    {
        tooltip: '右对齐',
        name: 'rightAligned',
        icon: '#icon-align-right',
    },
    {
        tooltip: '超链接',
        name: 'link',
        icon: '#icon-link',
    },
    {
        tooltip: '图片',
        name: 'img',
        icon: '#icon-img',
    },
    {
        tooltip: '代码段',
        name: 'code',
        icon: '#icon-code',
    },
    {
        tooltip: 'markdown',
        name: 'markdown',
        icon: '#icon-markdown',
    },
    {
        tooltip: '视频',
        name: 'radio',
        icon: '#icon-radio',
    },
    {
        tooltip: '清除样式',
        name: 'clearStyle',
        icon: '#icon-clear-style',
        commandHandle: (editor) => setFormat(editor, path => (path.node.formats = {}))
    },
]
export default toolBarOptions



function setFormat (editor, callback) {
    editor.selection.ranges.forEach((range) => {
        editor.$path.currentComponent.setFormat(range, callback)
    })
}
function setComponent (editor, callback) {
    editor.selection.ranges.forEach((range) => {
        editor.$path.currentComponent.setComponent(range, callback)
    })
}