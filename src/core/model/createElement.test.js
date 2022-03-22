import { createElement } from './index'

describe('参数缺省测试', () => {
  it('缺省ops', () => {
    const result = createElement('h1', 'xxxxxx')
    console.log(result)
    expect(result).toMatchObject({
      position: '0',
      static: true,
      children: [{ type: 'textNode', position: '0-0', parentNode: result }],
    })
  })
  it('缺省children', () => {
    const result = createElement('h1', { id: 'testId' })
    console.log(result)
    expect(result).toMatchObject({ position: '0', static: true, children: [] })
  })
})
