<!--
 * @Author: caiwu
 * @Description: 
 * @CreateDate: 
 * @LastEditor: 
 * @LastEditTime: 2022-09-19 17:20:27
-->

#### [演示/API文档地址👉[https://caiwuu.github.io/Typex/]](https://caiwuu.github.io/Typex/)
<br>

<div id="editor-root"></div>

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
|    |  ├─intercept
|    |  |     ├─index.js
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

### 三层架构

![image-20220829155638488](https://cdn.jsdelivr.net/gh/caiwuu/image/image-20220829155638488.png)

1. 应用层

应用层主要实现了编辑器的各种功能，以日常开发举例，内核相当于vue、react,应用层相当于我们基于他们开发的各种产品。在应用层可以实现各种各样的组件、格式，如表格、图片、时间线组件、todoList等等。应用层最主要的内容就是编写组件，定义格式，注册格式。举个例子编写一个图片组件，给图片组件实现一个点击放大缩小的功能，注册图片组件到内核。

```javascript
// formats/components/Image.js
import { Content } from '@/core'
export default class Image extends Content {
  render() {
    console.log(this)
    return (
      <img
        onMousedown={this.onMousedown}
        onClick={this.sizeChange}
        {...this.state.path.node.data}
      ></img>
    )
  }
  // 阻止事件冒泡导致光标移动
  onMousedown = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  sizeChange = (e) => {
    if (this.props.path.node.data.width === '50px') {
      this.props.path.node.data.width = '200px'
      this.props.path.node.data.height = '200px'
    } else {
      this.props.path.node.data.width = '50px'
      this.props.path.node.data.height = '50px'
    }
    this.update()
  }
  onAfterUpdate() {
    this.props.editor.selection.updateCaret()
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

### 重要概念

#### 1.Selection（ 选区 ）

selection 若干个范围（range）包含的区域称为选区,可通过`editor.selection`获取编辑器选区

#### 2.Range（范围）

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

#### 3.mapping 关系映射器

关系映射器用来记录和查找各种数据的踪迹。如根据dom找到vnode，通过vndoe找到path等等

- setVnElm 设置虚拟dom和真实dom的映射关系
- setVnIns 设置虚拟dom和组件实例的映射关系
- setVnPath 设置虚拟dom和path的映射关系
- getVnOrElm 获取虚拟dom或者dom，参数为dom则返回vnode，反之亦然
- getVnOrPath 获取虚拟dom或者path，参数为dom则返回path，反之亦然
- getVnOrIns 获取虚拟dom或者组件实例，参数为dom则返回组件实例，反之亦然

#### 4.数据模型

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

但是，这种格式并不适合操作，也不方便查找父级、兄弟节点，因此把这种数据包装成了path格式，path是内核中数据操作的模型，mark是数据传输的模型，path和mark是对应的。path.node 即对于当前mark。path是一个链表树。常用api或属性有

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

#### 5.Content 内容管理组件

内容管理组件是所有格式组件的基类，该组件定义了各种事件钩子，应用层中的组件只需要继承该组件，然后根据业务需求重写各种钩子即可实现各种各样定制化的功能。内置钩子/方法目前有：

- update() 组件更新
- onBeforeUpdate 组件更新前
- onAfterUpdate 组件更新后
- onBackspace 删除（退格键）
- onCaretEnter 光标进入
- onCaretLeave 光标离开
- onArrowUp 上箭头
- onArrowDown 下箭头
- onArrowRight 右箭头
- onArrowLeft 左箭头
- onEnter 回车
- onInsert 内容插入

####  6.Formater 格式排版器

##### 格式排版器Formater负责对mark数据进行解析，合并相同格式，通过公共格式提取分组法解决脏标签问题，最终翻译成vnode，交给视图层渲染。

![image-20220825010359677](https://cdn.jsdelivr.net/gh/caiwuu/image/202208250103792.png)

- register(format) 注册格式
- render(paths) 渲染path
- inject() 属性注入

#### 7.光标原理

每个`range`对象都有一个`caret`光标对象。本编辑器光标使用宽度为2`span`标签绝对定位来模拟的。光标对象记录了光标的位置信息，实现了光标更新绘制的一系列方法。

1. 更新光标

```js
// 更新编辑器所有光标
// drawCaret 是否绘制出光标UI，默认true
selection.updateCaret(drawCaret)
// 更新单个range的光标
range.updateCaret(drawCaret)
```

2. 光标几何属性 rect

```js
range.caret.rect.x // 水平坐标
range.caret.rect.y // 垂直坐标
range.caret.rect.height // 光标高度
```

3. 控制光标移动

```js
// caretMove 是事件名
// direction 值域为 left|right|up|down
// drawCaret 是否绘制光标UI
// shiftKey 是否按了shift键
this.editor.emit('caretMove', {
	direction: 'right',
	drawCaret: true,
	shiftKey: false,
})
```

4. 光标核心原理

   - **光标定位**：光标位置是通过在range container 的offset位置插入一个空text标签，获取text坐标之后再删除text标签并且重新连接被分割的container。位置测量被单独封装成Measure测量类，源码可在caret.js中查看。
   
     ```
     getRect(range) {
         return this.measure.measure(range.container, range.offset)
      }
     ```
   
     
   
   - **光标移动**：光标移动分为**水平移动**和**垂直移动**
   
     水平移动：水平移动比较简单，只需要计算range当前位置offset加减1即可，跨标签的时候需额外设置container。
   
     垂直移动：垂直移动可以分解为N步的水平移动，难点在于如何确定N。本编辑器采用状态回溯法确定最佳N。具体过程为让光标朝一个水平方向移动，在检测到跨行之后记录每次移动和初始位置的距离差值。而这其中的难点又在于如何判断跨行，关键代码如下
   
     ```
     // 跨行判断
     function isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, editor) {
       // 标识光标是否在同一行移动
       let sameLine = true
       // 判断自动折行(非结构层面的换行,如一行文字太长被浏览器自动换行的情况)
       // 这种情况第一行必定会占满整个屏幕宽度，只需要判断前后光标位置是否为一个屏幕宽度减去一个字符宽度即可
       // 这里通过判断前后两个光标位置距离是否大于一定的值来判断
       if (
         Math.abs(currCaretInfo.x - prevCaretInfo.x) >
         editor.ui.body.offsetWidth - 2 * currCaretInfo.height
       ) {
         sameLine = false
       }
       // 当前光标位置和前一个位置所属块不一致则肯定发生跨行
       if (currCaretInfo.belongBlock !== prevCaretInfo.belongBlock) {
         sameLine = false
       }
       //光标Y坐标和参考点相同说明光标还在本行，最理想的情况放在最后判断
       if (currCaretInfo.y === initialCaretInfo.y) {
         sameLine = true
       }
       return sameLine
     }
     
     // 循环移动
     function loop(range, direction, initialCaretInfo, prevCaretInfo, lineChanged = false, shiftKey) {
       if (range.collapsed) {
         range.d = 0
       }
       const { path } = horizontalMove.call(this, range, direction, shiftKey) || {}
       if (!path) return
       if (!lineChanged) {
         range.updateCaret(false)
       } else {
         range.updateCaret(false)
         const belongBlock = getBelongBlock(path)
         const currCaretInfo = { ...range.caret.rect, belongBlock },
           preDistance = Math.abs(prevCaretInfo.x - initialCaretInfo.x),
           currDistance = Math.abs(currCaretInfo.x - initialCaretInfo.x),
           sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, this)
         if (!(currDistance <= preDistance && sameLine)) {
           const d = direction === 'left' ? 'right' : 'left'
           horizontalMove.call(this, range, d, shiftKey)
           range.updateCaret(false)
           return
         }
       }
       const belongBlock = getBelongBlock(path)
       const currCaretInfo = { ...range.caret.rect, belongBlock },
         sameLine = isSameLine(initialCaretInfo, prevCaretInfo, currCaretInfo, this)
       if (!sameLine) {
         lineChanged = true
       }
       return loop.call(this, range, direction, initialCaretInfo, currCaretInfo, lineChanged, shiftKey)
     }
     ```

​              ![image-20220919170408491](https://cdn.jsdelivr.net/gh/caiwuu/image/image-20220919170408491.png)

​				




## TODO

- 完善action（上下移动,回车,加粗,颜色设置....）
- 丰富和完善组件类型
- 复制粘贴
- 工具栏
- API优化
- 协同编辑

<script defer="defer" src="./dist/index.js"></script>