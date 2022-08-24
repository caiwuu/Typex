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

#### 重要概念

##### Selection（ 选区 ）

selection 若干个范围（range）包含的区域称为选区,可通过`editor.selection`获取编辑器选区

##### Range（范围）

由起始边界和结尾边界包含的一段范围；起始边界由startContainer和startOffset定位，结尾边界由endContainer和endOffset定位。

当container为文本节点时，偏移量是指文字偏移量；其他情况为container相对于父节点的偏移量。Range列表可由`selection.ranges获取`。

常用api和属性有：

- startContainer 起始边界容器
- endContainer 结尾边界容器
- startOffset 起始边界偏移量
- endOffset 结尾边界偏移量
- container 边界容器，是startContainer 和 endContainer 中的一个，由d属性决定
- offset 偏移量，是 startOffset 和 endOffset  中的一个，由d属性决定
- collapsed 选区是否折叠，折叠指startContainer 和endContainer 相同，startOffset 和endOffset  相同
- d 范围方向，折叠状态为0，结尾边界不动，向左移动起始边界产生范围，d为-1；起始边界不动，向右移结尾始边界产生范围，d为1
- setEnd(endContainer ，endOffset ) 设置结尾边界
- setStart(startContainer ，startOffset ) 设置起始边界
- set(container ，offset ) 设置边界，具体设置哪个由d决定
- collapse(toStart) 折叠范围
- updateCaret(*drawCaret*) 更新光标位置
- remove() 移除范围

##### mapping 关系映射器

关系映射器用来记录和查找各种数据的踪迹。如根据dom找到vnode，通过vndoe找到path等等

- setVnElm 设置虚拟dom和真实dom的映射关系
- setVnIns 设置虚拟dom和组件实例的映射关系
- setVnPath 设置虚拟dom和path的映射关系
- getVnOrElm 获取虚拟dom或者dom，参数为dom则返回vnode，反之亦然
- getVnOrPath 获取虚拟dom或者path，参数为dom则返回path，反之亦然
- getVnOrIns 获取虚拟dom或者组件实例，参数为dom则返回组件实例，反之亦然

##### 数据模型

本内核独创了一种格式标记模型mark用来描述文档的内容和格式，其中data为内容，formats为格式

```javascript
// 文本mark，描述了一个红色的、加粗的、字体大小为12px的文字“hello world”
{
    data:'hello world',
    formats:{color：red，bold:true,fontSize: '12px'}
}
// 组件格式，描述了一个段落，它的内容为一个红色的、加粗的、字体大小为12px的文字“hello world”
{
    data: {
        marks: [
            { data: 'hello world', formats: { color: 'green' } },
        ],
    },
    formats: { paragraph: true },
},
```

但是，这种格式并不适合操作，也不方便查找父级、兄弟节点，因此把这种数据包装成了path格式，path是内核中数据操作的模型，mark是数据传输的模型，path和mark是对应的。path.node 即对于当前mark。path是一个链表树。采用api或属性有

- component 属于的组件
- node 对应的mark
- parent 父级
- position 从根到当前位置的索引链 如0-1-2-0-1
- prevSibling 上一个兄弟节点
- nextSibling 下一个兄弟节点
- children 子集
- len 内容长度
- elm  path对应的真实dom
- vn path对应的虚拟节点
- isLeaf 是否是叶子节点
- firstLeaf 第一个子叶子节点
- lastLeaf 最后一个子叶子节点
- index 同级索引
- delete()
- reArrange()
- traverse()

##### Content 内容管理组件

内容管理组件是所有格式组件的基类，该组件定义了各种事件钩子，应用层中的组件只需要继承该组件，然后根据业务需求重写各种钩子即可实现各种各样定制化的功能。内置钩子目前有：

- onBackspace 删除（退格键）
- onCaretEnter 光标进入
- onCaretLeave 光标离开
- onArrowUp 上箭头
- onArrowDown 下箭头
- onArrowRight 右箭头
- onArrowLeft 左箭头
- onEnter 回车
- onInsert 内容插入

## TODO

- 完善action（上下移动,回车,加粗,颜色设置....）
- 丰富和完善组件类型
- 复制粘贴
- 工具栏
- API优化
- 协同编辑