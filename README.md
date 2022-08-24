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

1. 应用层

应用层主要实现了编辑器的各种功能，举个日常开发举例，内核相当于vue、react,应用层相当于我们基于他们开发的各种产品。在应用层可以实现各种各样的组件、格式，如表格、图片、时间线组件、todoList等等。应用层最主要的内容就是编写组件，定义格式，注册格式。举个例子编写一个图片组件，给图片组件实现一个点击放大缩小的功能，注册图片组件到内核。

```javascript
// formats/components/Image.js
import { Content } from '@/core'
export default class Image extends Content {
  render() {
    console.log(this)
    return <img onClick={this.sizeChange} {...this.state.path.node.data}></img>
  }
  sizeChange = () => {
    if (this.state.path.node.data.width === '50px') {
      this.state.path.node.data.width = '200px'
      this.state.path.node.data.height = '200px'
      this.setState()
    } else {
      this.state.path.node.data.width = '50px'
      this.state.path.node.data.height = '50px'
      this.setState()
    }
  }
  onCaretEnter(path, range, isStart) {
    range.setStart(path.parent, path.index + isStart ? 0 : 1)
  }
  get contentLength() {
    return 1
  }
}
// format/index.js
import { Formater } from '@/core'
const formater = new Formater()
import { Image } from './components'
const image = {
  name: 'image',
  isLeaf: true,
  type: 'component',
  render(vnode, path) {
    const vn = <Image path={path}></Image>
    if (vnode) {
      vnode.children.push(vn)
    }
    return vn
  },
}
formater.register(image)

// 这样image这个格式就生效了，当你插入一张图片，它在mark（内核数据模型）中的表示是这样的
{
  data: {
    src: 'https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
    alt: 'test image',
    width: '50px',
    height: '50px',
  },
  formats: { image: true },
},
```

2. 平台层

平台层的主要作用有两个，一是统一封装平台相关的api供内核层调用，如dom操作、光标绘制等等；二是提供事件拦截的作用，如键盘输入拦截和鼠标事件拦截。平台层是人机交互的桥梁。

3. 内核层

内核层是最复杂的，包含了动作也称命令层（action），视图层（view）、数据模型层（model）、选区、关系映射、历史记录等。

- 动作层定义系统默认的动作，如光标移动，删除插入等等，用户可以在应用层注册自定义动作
- 视图层实现了虚拟dom的渲染和更新操作
- model层定义编辑器的数据操作模型（Path）、内容管理器（Content）、格式排版器（Formater）
- 选区主要对原生选区重写，加入了许多定制化功能和属性
- 关系映射维护了vnode、path、dom、ins之间的映射关系，并且提供了相互的查找方法。
- 历史记录（TODO）

![image-20220824224127235](https://cdn.jsdelivr.net/gh/caiwuu/image/202208242241362.png)

![image-20220824230634086](https://cdn.jsdelivr.net/gh/caiwuu/image/202208242308180.png)

## TODO

- 完善action（上下移动,回车,加粗,颜色设置....）
- 丰富和完善组件类型
- 复制粘贴
- 工具栏
- API优化
- 协同编辑