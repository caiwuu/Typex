#### [演示/API文档地址👉[https://caiwuu.github.io/Typex/]](https://caiwuu.github.io/Typex/)
<br>

<div id="editor-root"></div>

## 特点
- 不依赖contentEditable；不依赖document.execCommand
- 自绘光标、模拟输入，支持多光标；可自定义各个组件的光标和输入行为
- 组件化、状态驱动、自建数据模型;高性能、高拓展性、高可控
- 跨平台设计:内核和平台相关代码分离，通过平台插件注入
## 目录结构
```js
src
├─index.js
├─style.styl
├─platform 平台插件
|    ├─coreContext.js 内核上下文
|    ├─index.js
|    ├─web web相关代码
|    |  ├─caret.js
|    |  ├─createElm.js
|    |  ├─dom.js
|    |  ├─index.js
|    |  ├─utils.js
|    |  ├─updateProps dom属性更新
|    |  |      ├─index.js
|    |  |      ├─modules
|    |  |      |    ├─attributes.js
|    |  |      |    ├─classes.js
|    |  |      |    ├─listeners.js
|    |  |      |    └styles.js
|    |  ├─intercept 拦截器
|    |  |     ├─index.js
|    |  |     ├─keyboardIntercept.js 键盘拦截
|    |  |     └mouseIntercept.js 鼠标拦截
├─editor
|   ├─data.js mock数据
|   ├─index.js
|   ├─mount.js
|   ├─toolBar 工具栏
|   |    ├─iconfont.js
|   |    ├─index.js
|   |    └toolBar.styl
|   ├─formats 格式
|   |    ├─index.js
|   |    ├─components 格式组件
|   |    |     ├─Image.js
|   |    |     ├─index.js
|   |    |     ├─Inline.js
|   |    |     ├─Paragraph.js
|   |    |     ├─Root.js
|   |    |     ├─Static.js
|   |    |     └Table.js
├─core 内核
|  ├─core.js
|  ├─index.js
|  ├─initCore.js 内核启动器
|  ├─mappings.js 映射器
|  ├─pluginContext.js 插件上下文
|  ├─utils.js
|  ├─view 视图绘制层
|  |  ├─component.js
|  |  ├─index.js
|  |  ├─vdom 虚拟dom
|  |  |  ├─createRef.js
|  |  |  ├─createVnode.js
|  |  |  ├─enqueueSetState.js
|  |  |  └patch.js
|  ├─selection 选取
|  |     ├─index.js
|  |     ├─style.css
|  |     ├─range
|  |     |   └index.js
|  ├─ot OT协同 TODO
|  | └operation.js
|  ├─model 数据模型层
|  |   ├─content.js 内容管理类
|  |   ├─block.js 块级内容类
|  |   ├─formater.js 格式排版类
|  |   ├─index.js
|  |   └path.js 路径类
|  ├─history 历史记录 TODO
|  |    └index.js
|  ├─defaultActions 内置动作
|  |       ├─caretMove.js
|  |       ├─delete.js
|  |       └input.js
```

## TODO

- 协同编辑
- 历史记录
- 复制粘贴
- API 优化

<script defer="defer" src="./dist/index.js"></script>