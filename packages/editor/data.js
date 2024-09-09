/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-11-22 16:32:36
 */
// 数据结构说明 path 包含 data和formats；marks 是一个path组成的列表
export const mockData = {
  "data": [
    {
      "data": [
        {
          "data": "这是一个基于Typex编写的",
          "formats": {
            "color": "rgba(255,165,0,1)",
            "bold": true,
            "fontSize": "20px"
          }
        },
        {
          "data": "简单富文本编辑器Demo",
          "formats": {
            "color": "rgba(255,165,0,1)",
            "bold": true,
            "fontSize": "20px",
            "underline": true
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "1.什么是Typex？",
          "formats": {
            "bold": true
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "Typex并不是一款开箱即用的富文本编辑器，他是一个编辑器内核，可以理解成开发富文本编辑器的一个框架，它组件化的设计和原子化的API可以很方便的创建一个富文本编辑器。",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "2.Typex有什么特色",
          "formats": {
            "bold": true
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- ",
          "formats": {}
        },
        {
          "data": "组件化",
          "formats": {
            "bold": true,
            "color": "rgba(255,165,0,1)"
          }
        },
        {
          "data": "：",
          "formats": {}
        },
        {
          "data": "在Typex中，所有格式都可以通过继承Content组件来自定义，比如",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "段落、图片、代码块、表格",
          "formats": {
            "background": "rgba(255,165,0,0.3740625)",
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "等等；组件是一等公民，你甚至可以在不同的组件里自定义光标的移动方式，任何默认行为都可以通过重写Content的方法来实现",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "。",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- ",
          "formats": {}
        },
        {
          "data": "不依赖contenteditable",
          "formats": {
            "bold": true,
            "color": "rgba(255,165,0,1)"
          }
        },
        {
          "data": "：",
          "formats": {}
        },
        {
          "data": "这是和其他富文本编辑器很大的不同的地方，你打开F12审查元素你会发现整个文档其实就是个div，但是它却没有使用contenteditable，它的",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "光标、选区、输入都是模拟的",
          "formats": {
            "background": "rgba(138,43,226,0.2290625)",
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "，这意味着它是完全可控的，不会有因为浏览器不同而导致一致性问题",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        },
        {
          "data": "。",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "-",
          "formats": {}
        },
        {
          "data": " ",
          "formats": {
            "color": "rgba(102,102,102,1)"
          }
        },
        {
          "data": "无脏标签",
          "formats": {
            "bold": true,
            "color": "rgba(255,165,0,1)"
          }
        },
        {
          "data": "：",
          "formats": {}
        },
        {
          "data": "Typex采用了独特的排版算法，可以使标签最简化，不会出现冗余嵌套问题",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- ",
          "formats": {}
        },
        {
          "data": "支持多光标操作",
          "formats": {
            "bold": true,
            "color": "rgba(255,165,0,1)"
          }
        },
        {
          "data": "：",
          "formats": {
            "bold": true,
            "color": "rgba(102,102,102,1)"
          }
        },
        {
          "data": " ",
          "formats": {
            "bold": false,
            "color": "rgba(102,102,102,1)"
          }
        },
        {
          "data": "按住alt键点击鼠标左键即可多光标",
          "formats": {
            "bold": false,
            "color": "rgba(51,51,51,1)"
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- ",
          "formats": {}
        },
        {
          "data": "数据驱动",
          "formats": {
            "color": "rgba(255,165,0,1)",
            "bold": true
          }
        },
        {
          "data": "：",
          "formats": {}
        },
        {
          "data": "Typex是数据驱动的,Typex组件根据传递的 props 和内部状态（state）来渲染 UI。当数据发生变化时，组件会自动重新渲染，以反映最新的状态。",
          "formats": {
            "color": "rgba(51,51,51,1)"
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "3.Typex 还有什么不足",
          "formats": {
            "bold": true
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- 组件太少：目前内核处于开发阶段，内核稳定之后会着重组件的开发",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- 还存在些已知Bug，由于富文本编辑器的复杂度高，有些边界问题可能没包含，后续还需要增加测试",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "4.TODO",
          "formats": {
            "bold": true
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- 完善原子化操作（",
          "formats": {}
        },
        {
          "data": "完成度40%",
          "formats": {
            "background": "rgba(255,255,0,0.3490625)"
          }
        },
        {
          "data": "）",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- 协同操作（有方案尚未开发）",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- 复制粘贴",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "- API优化",
          "formats": {}
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    {
      "data": [
        {
          "data": "最后热烈欢迎对富文本编辑器内核的同学参与开发",
          "formats": {
            "bold": true,
            "fontSize": "36px",
            "underline": true,
            "background": "rgba(255,0,0,0.1140625)",
            "color": "rgba(163.996875,109.01920744243425,8.226816920230263,1)"
          }
        }
      ],
      "formats": {
        "paragraph": true
      }
    },
    // {
    //   "data": [
    //     {
    //       "data": "带静态内容的行内图片示例",
    //       "formats": {
    //         "color": "#ff9999",
    //         "fontSize": "24px"
    //       }
    //     },
    //     {
    //       "data": {
    //         "src": "https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
    //         "alt": "test image",
    //         "width": "60px",
    //         "height": "60px"
    //       },
    //       "formats": {
    //         "image": true
    //       }
    //     },
    //     {
    //       "data": {
    //         "src": "https://img2.baidu.com/it/u=3979034437,2878656671&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333",
    //         "alt": "test image",
    //         "width": "50px",
    //         "height": "50px"
    //       },
    //       "formats": {
    //         "image": true
    //       }
    //     }
    //   ],
    //   "formats": {
    //     "paragraph": true
    //   }
    // },
    // {
    //   "data": [
    //     {
    //       "data": "表格示例:",
    //       "formats": {
    //         "color": "#666",
    //         "bold": true
    //       }
    //     }
    //   ],
    //   "formats": {
    //     "paragraph": true
    //   }
    // },
    // {
    //     "data": [
    //         {
    //             "data": [
    //                 {
    //                     "data": [
    //                         {
    //                             "data": [
    //                                 {
    //                                     "data": "表格内容1",
    //                                     "formats": {
    //                                         "color": "green"
    //                                     }
    //                                 }
    //                             ],
    //                             "formats": {
    //                                 "paragraph": true
    //                             }
    //                         },
    //                         {
    //                             "data": [
    //                                 {
    //                                     "data": "表格内容2",
    //                                     "formats": {
    //                                         "color": "red",
    //                                         "fontSize": "12px"
    //                                     }
    //                                 }
    //                             ],
    //                             "formats": {
    //                                 "paragraph": true
    //                             }
    //                         }
    //                     ],
    //                     "formats": {
    //                         "col": true
    //                     }
    //                 },
    //                 {
    //                     "data": [
    //                         {
    //                             "data": [
    //                                 {
    //                                     "data": "表格内容2",
    //                                     "formats": {
    //                                         "color": "Orange",
    //                                         "fontSize": "20px",
    //                                         "background": "#ddd"
    //                                     }
    //                                 }
    //                             ],
    //                             "formats": {
    //                                 "paragraph": true
    //                             }
    //                         }
    //                     ],
    //                     "formats": {
    //                         "col": true
    //                     }
    //                 }
    //             ],
    //             "formats": {
    //                 "row": true
    //             }
    //         }
    //     ],
    //     "formats": {
    //         "table": true
    //     }
    // }
  ],
  "formats": {
    "root": true
  }
}
