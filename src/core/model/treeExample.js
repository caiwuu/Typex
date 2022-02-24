const treeExample = {
  type: 'body',
  tag: 'p',
  children: [
    {
      type: 'context',
      contexts: [
        { type: 'textVNode', context: '11111' },
        { type: 'static', contexts: [{ type: 'img', src: 'ssss' }] },
      ],
    },
    {
      type: 'elementVnode',
    },
  ],
}

class myCom extends Editor.Components {
  render() {
    return (
      <div>
        <span>不可编辑文本</span>
        <context>
          <span>可编辑文本</span>
        </context>
        <p>
          <span>不可编辑图标</span>
          <context>一段内容</context>
        </p>
      </div>
    )
  }
}

;`dom-->vnode---{ele,vm:{state}}`
;`vm:{state}->vnode--dom`
