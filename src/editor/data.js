/*
 * @Author: caiwu
 * @Description:
 * @CreateDate:
 * @LastEditor:
 * @LastEditTime: 2022-08-12 15:26:35
 */
export const mockData = {
  data: {
    marks: [
      { data: '111', formats: { color: 'red' } },
      { data: '222', formats: { del: true, color: 'green' } },
      {
        data: {
          marks: [
            {
              data: '12px',
              formats: { color: 'green', fontSize: '12px' },
            },
          ],
        },
        formats: { paragraph: true },
      },
      {
        data: {
          marks: [
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
        },
        formats: { paragraph: true },
      },
      {
        data: {
          marks: [
            {
              data: 'this is Paragraph',
              formats: { color: 'green' },
            },
          ],
        },
        formats: { paragraph: true },
      },
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
      { data: 'www', formats: { color: 'green' } },
      {
        data: {
          marks: [
            { data: 'qqq', formats: { color: 'green' } },
            { data: 'www', formats: { color: 'green' } },
          ],
        },
        formats: { paragraph: true },
      },
      {
        data: {
          marks: [
            {
              data: {
                marks: [
                  {
                    data: {
                      marks: [
                        {
                          data: '1111',
                          formats: { color: 'red', bold: true },
                        },
                        {
                          data: '333',
                          formats: { del: true, color: 'red' },
                        },
                      ],
                    },
                    formats: { col: true },
                  },
                  {
                    data: {
                      marks: [
                        {
                          data: '1111',
                          formats: { color: 'green' },
                        },
                      ],
                    },
                    formats: { col: true },
                  },
                ],
              },
              formats: { row: true },
            },
          ],
        },
        formats: {
          table: true,
        },
      },
    ],
  },
  formats: { root: true },
}

// console.log(mockData)