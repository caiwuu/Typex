/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:32:36
 */
// 数据结构说明 path 包含 data和formats；marks 是一个path组成的列表
export const mockData = {
  data: [
    {
      data: [{ data: 'qwertyuiopqwertyuiop' }],
      formats: { paragraph: true },
    },
    {
      data: [{ data: '1' }],
      formats: { paragraph: true },
    },
    {
      data: [{ data: 'qwertyuiopqwertyuiop', formats: { bold: true } }],
      formats: { paragraph: true },
    },
    {
      data: [
        {
          data: '这是一个基于Typex编写的简单富文本编辑器demo',
          formats: { color: '#666', bold: true, fontSize: '20px' },
        },
      ],
      formats: { paragraph: true },
    },
    {
      data: [
        { data: 'Typex', formats: { color: '#ff9999' } },
        {
          data: '是一款全新架构的编辑器内核，该内核不依赖contenteditable;自主实现了光标、模拟输入、模拟选区;数据驱动，组件化，插件化，支持多光标，跨平台的设计。优秀的格式排版系统避免了脏标签的产生（打开控制台你会发现它的标签非常简洁）。多光标：按住alt+左键；加粗/取消加粗：ctrl+b；删除线/取消删除线：ctrl+d；上标/取消上标：ctrl+s ....',
          formats: { color: '#999' },
        },
        { data: 'qwertyuiopqwertyuiop' },
      ],
      formats: { paragraph: true },
    },
    {
      data: [
        {
          data: '36px-green',
          formats: { color: 'green', fontSize: '36px' },
        },
        {
          data: '12px-red',
          formats: { color: 'red', fontSize: '12px' },
        },
        {
          data: '18px-red',
          formats: { color: 'red', fontSize: '18px' },
        },
      ],
      formats: { paragraph: true },
    },
    {
      data: [
        {
          data: '点击图片放大缩小图片=> ',
          formats: { color: '#ff9999', fontSize: '24px' },
        },
        {
          data: {
            src: 'https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
            alt: 'test image',
            width: '60px',
            height: '60px',
          },
          formats: { image: true },
        },
        {
          data: {
            src: 'https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333',
            alt: 'test image',
            width: '50px',
            height: '50px',
          },
          formats: { image: true },
        },
      ],
      formats: { paragraph: true },
    },
    {
      data: [
        {
          data: 'this is Paragraph',
          formats: { color: 'green' },
        },
      ],
      formats: { paragraph: true },
    },

    {
      data: [
        {
          data: 'world',
          formats: { del: true, color: 'red' },
        },
        { data: 'eee', formats: { del: true, color: 'green' } },
        {
          data: 'hhhha',
          formats: { sup: true, del: true, color: 'green', fontSize: '12px' },
        },
        { data: 'qqq', formats: { color: 'green' } },
        {
          data: '分词器',
          formats: { color: 'green' },
        },
      ],
      formats: { paragraph: true },
    },
    {
      data: [
        { data: 'qqq', formats: { color: 'green' } },
        { data: 'www', formats: { color: 'red' } },
      ],
      formats: { paragraph: true },
    },
    // {
    //   data: [
    //     {
    //       data: [
    //         {
    //           data: [
    //             {
    //               data: '1111',
    //               formats: { color: 'red', bold: true },
    //             },
    //             {
    //               data: '333',
    //               formats: { del: true, color: 'red', fontSize: '22px' },
    //             },
    //           ],
    //           formats: { col: true },
    //         },
    //         {
    //           data: [
    //             {
    //               data: '1111',
    //               formats: { color: 'green' },
    //             },
    //           ],
    //           formats: { col: true },
    //         },
    //       ],
    //       formats: { row: true },
    //     },
    //   ],
    //   formats: {
    //     table: true,
    //   },
    // },
  ],
  formats: { root: true },
}
