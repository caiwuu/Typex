import { Table, Row, Col, Image, Paragraph, Root, Header } from './components'
const root = {
  name: 'root',
  type: 'component',
  render (value, props) {
    return <Root {...props}></Root>
  },
}
const paragraph = {
  name: 'paragraph',
  type: 'component',
  render (value, props) {
    return <Paragraph {...props} key={props.path._uuid}></Paragraph>
  },
}
const header = {
  name: 'header',
  type: 'component',
  render (value, props) {
    return <Header {...props} level={value} key={props.path._uuid}></Header>
  },
}

const bold = {
  name: 'bold',
  type: 'tag',
  render () {
    return <strong></strong>
  },
}
const underline = {
  name: 'underline',
  type: 'tag',
  render () {
    return <u></u>
  },
}
const fontSize = {
  name: 'fontSize',
  type: 'attribute',
  render (value) {
    return <span style={{ fontSize: value }}></span>
  },
}
const background = {
  name: 'background',
  type: 'attribute',
  render (value) {
    return <span style={{ background: value }}></span>
  },
}
const color = {
  name: 'color',
  type: 'attribute',
  attrName: 'style.color',
  render (value) {
    return <span style={{ color: value }}></span>
  },
}
const deleteline = {
  name: 'deleteline',
  type: 'tag',
  render () {
    return <del></del>
  },
}
const sup = {
  name: 'sup',
  type: 'tag',
  render () {
    return <sup></sup>
  },
}
const sub = {
  name: 'sub',
  type: 'tag',
  render () {
    return <sub></sub>
  },
}
const table = {
  name: 'table',
  type: 'component',
  render (pvalue, props) {
    return <Table {...props}></Table>
  },
}
const row = {
  name: 'row',
  type: 'component',
  render (value, props) {
    return <Row {...props}></Row>
  },
}
const col = {
  name: 'col',
  type: 'component',
  render (value, props) {
    return <Col {...props}></Col>
  },
}
const image = {
  name: 'image',
  type: 'component',
  render (value, props) {
    return <Image {...props}></Image>
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
