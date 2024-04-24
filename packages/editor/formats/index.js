import { Table, Row, Col, Image, Paragraph, Root, Header } from './components'
const root = {
  name: 'root',
  type: 'component',
  render (parentVnode, props) {
    return <Root {...props}></Root>
  },
}
const paragraph = {
  name: 'paragraph',
  type: 'component',
  render (parentVnode, props) {
    const vn = <Paragraph {...props} key={props.path._uuid}></Paragraph>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const header = {
  name: 'header',
  type: 'component',
  render (parentVnode, props, value) {
    const vn = <Header {...props} level={value} key={props.path._uuid}></Header>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}

const bold = {
  name: 'bold',
  type: 'tag',
  render (parentVnode) {
    const vn = <strong></strong>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const underline = {
  name: 'underline',
  type: 'tag',
  render (parentVnode) {
    const vn = <u></u>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const fontSize = {
  name: 'fontSize',
  type: 'attribute',
  render (parentVnode, value) {
    if (parentVnode) {
      if (!parentVnode.props.style) parentVnode.props.style = {}
      parentVnode.props.style['fontSize'] = value
    } else {
      return <span style={{ fontSize: value }}></span>
    }
  },
}
const background = {
  name: 'background',
  type: 'attribute',
  render (parentVnode, value) {
    if (parentVnode) {
      if (!parentVnode.props.style) parentVnode.props.style = {}
      parentVnode.props.style['background'] = value
    } else {
      return <span style={{ background: value }}></span>
    }
  },
}
const color = {
  name: 'color',
  type: 'attribute',
  render (parentVnode, value) {
    if (parentVnode) {
      if (!parentVnode.props.style) parentVnode.props.style = {}
      parentVnode.props.style['color'] = value
    } else {
      return <span style={{ color: value }}></span>
    }
  },
}
const deleteline = {
  name: 'deleteline',
  type: 'tag',
  render (parentVnode) {
    const vn = <del></del>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const sup = {
  name: 'sup',
  type: 'tag',
  render (parentVnode) {
    const vn = <sup></sup>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const sub = {
  name: 'sub',
  type: 'tag',
  render (parentVnode) {
    const vn = <sub></sub>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const table = {
  name: 'table',
  type: 'component',
  render (parentVnode, props) {
    const vn = <Table {...props}></Table>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const row = {
  name: 'row',
  type: 'component',
  render (parentVnode, props) {
    const vn = <Row {...props}></Row>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const col = {
  name: 'col',
  type: 'component',
  render (parentVnode, props) {
    const vn = <Col {...props}></Col>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
const image = {
  name: 'image',
  type: 'component',
  render (parentVnode, props) {
    const vn = <Image {...props}></Image>
    if (parentVnode) {
      parentVnode.children.push(vn)
    }
    return vn
  },
}
export default [
  root,
  bold,
  image,
  underline,
  fontSize,
  color,
  paragraph,
  deleteline,
  sup,
  sub,
  table,
  row,
  col,
  background,
  header,
]
