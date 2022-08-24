<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-08-15 10:10:10
-->
## 特点
- 不依赖contentEditable
- 自主实现光标、选区、输入
- 状态驱动、自建数据模型
- 组件化、跨平台、高拓展性、高性能
## 目录结构
```js
src
├─index.js
├─style.styl
├─platform 平台相关代码
|    ├─index.js
|    ├─web web平台
|    |  ├─caret.js 光标绘制
|    |  ├─createElm.js 创建真实dom
|    |  ├─dom.js dom操作方法
|    |  ├─index.js
|    |  ├─utils.js
|    |  ├─updateProps 节点属性更新
|    |  |      ├─index.js
|    |  |      ├─modules 节点属性更新模块
|    |  |      |    ├─attributes.js
|    |  |      |    ├─classes.js
|    |  |      |    ├─listeners.js
|    |  |      |    └styles.js
|    |  ├─intercept 事件拦截器
|    |  |     ├─del.js 删除处理
|    |  |     ├─index.js
|    |  |     ├─input.js 键盘输入处理
|    |  |     ├─keyboardIntercept.js 键盘拦截
|    |  |     └mouseIntercept.js 鼠标拦截
├─modelTestDemo view模块复杂组件测试
|       ├─index.js
|       ├─colorPicker 颜色选择器
|       |      ├─hue.js
|       |      ├─index.js
|       |      ├─palette.js
|       |      └utils.js
├─editor 编辑器应用层
|   ├─data.js 模拟数据
|   ├─formats.js 格式定义
|   ├─index.js
|   ├─mount.js 根挂载渲染
|   ├─formats 格式
|   |    ├─index.js 格式定义和注册
|   |    ├─components 格式组件
|   |    |     ├─Block.js 块
|   |    |     ├─Image.js 图片
|   |    |     ├─index.js 
|   |    |     ├─Inline.js 行内块
|   |    |     ├─Paragraph.js 段落
|   |    |     ├─Root.js 根
|   |    |     └Table.js 表格 
├─core 内核层
|  ├─index.js
|  ├─mappings.js 关系映射器
|  ├─run.js 内核启动器
|  ├─utils.js
|  ├─view 视图层
|  |  ├─component.js 组件基类
|  |  ├─index.js
|  |  ├─vdom
|  |  |  ├─createRef.js ref创建函数
|  |  |  ├─createVnode.js 虚拟dom创建函数
|  |  |  ├─enqueueSetState.js 状态更新调度器
|  |  |  └patch.js diff函数
|  ├─selection 选区
|  |     ├─index.js
|  |     ├─style.css
|  |     ├─range 范围
|  |     |   └index.js
|  ├─model model层
|  |   ├─content.js 内容组件基类
|  |   ├─formater.js 格式排版器
|  |   ├─index.js
|  |   └path.js 路劲生成函数
|  ├─actions 动作
|  |    ├─caretMove.js 光标移动
|  |    ├─delete.js 内容删除
|  |    ├─index.js
|  |    └insert.js 内容插入
```
## 总体架构

#### 三层架构

![image-20220824155836618](https://cdn.jsdelivr.net/gh/caiwuu/image/image-20220824155836618.png)

## TODO

- 完善action（上下移动,回车,加粗,颜色设置....）
- 丰富和完善组件类型
- 复制粘贴
- 工具栏
- API优化
- 协同编辑