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
