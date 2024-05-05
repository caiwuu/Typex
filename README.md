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
packages 包
├─editor 编辑器应用 
|   ├─babel.config.json
|   ├─data.js mock 数据
|   ├─index.js
|   ├─mount.js
|   ├─package.json
|   ├─toolBar 工具栏
|   |    ├─iconfont.js
|   |    ├─index.js
|   |    ├─toolBarOptions.js
|   |    ├─compinents
|   |    |     ├─Dialog.js
|   |    |     ├─DialogContent.js
|   |    |     ├─index.js
|   |    |     ├─toolBar.styl
|   |    |     ├─Tooltip.js
|   |    |     ├─colorPicker
|   |    |     |      ├─controlPanel.js
|   |    |     |      ├─index.js
|   |    |     |      ├─palette.js
|   |    |     |      └utils.js
|   ├─formats 定义格式
|   |    ├─index.js
|   |    ├─components 自定义格式组件
|   |    |     ├─block.js
|   |    |     ├─Header.js
|   |    |     ├─Image.js
|   |    |     ├─index.js
|   |    |     ├─Inline.js
|   |    |     ├─Paragraph.js
|   |    |     ├─Root.js
|   |    |     ├─Static.js
|   |    |     └Table.js
├─babel-plugin-transform-typex-jsx typex的jsx babel插件
|                ├─index.js
|                └package.json
├─@typex-platform 平台相关代码
|        ├─coreContext.js
|        ├─index.js
|        ├─package.json
|        ├─web web平台
|        |  ├─caret.js 光标实现
|        |  ├─createElm.js 创建dom
|        |  ├─dom.js
|        |  ├─index.js
|        |  ├─utils.js
|        |  ├─updateProps 处理dom属性更新
|        |  |      ├─index.js
|        |  |      ├─modules
|        |  |      |    ├─attributes.js
|        |  |      |    ├─classes.js
|        |  |      |    ├─listeners.js
|        |  |      |    └styles.js
|        |  ├─intercept 拦截器 拦截键盘鼠标事件
|        |  |     ├─index.js
|        |  |     ├─keyboardIntercept.js
|        |  |     └mouseIntercept.js
├─@typex-core 编辑器内核
|      ├─.babelrc.js
|      ├─constDefine.js 常量
|      ├─core.js 
|      ├─index.js
|      ├─initCore.js 初始化内核
|      ├─mappings.js 维护虚拟dom 组件实例 path等的映射关系
|      ├─package.json
|      ├─pluginContext.js
|      ├─Typex.js 
|      ├─utils.js
|      ├─view 视图层
|      |  ├─component.js 组件基类
|      |  ├─index.js
|      |  ├─vdom 虚拟dom
|      |  |  ├─createRef.js
|      |  |  ├─createVnode.js
|      |  |  ├─enqueueSetState.js
|      |  |  └patch.js
|      ├─transform 定义原子化操作
|      |     ├─step.js
|      |     └transaction.js
|      ├─selection 选取类
|      |     ├─index.js
|      |     ├─range
|      |     |   └index.js
|      ├─ot
|      | └operation.js
|      ├─model 模型层
|      |   ├─content.js 内容管理基类
|      |   ├─formater.js 格式排版器
|      |   ├─index.js
|      |   └path.js 路径类
|      ├─history 历史记录
|      |    └index.js
|      ├─defaultActions 里面定义了一些内核默认操作
|      |       ├─caretMove.js
|      |       └delete.js
```

## TODO

- 协同编辑
- 历史记录
- 复制粘贴
- API 优化

<script defer="defer" src="./dist/index.js"></script>