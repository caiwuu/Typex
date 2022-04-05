const queue = []
const componentQueue = []
export default function enqueueSetState(partialState, component) {
  if (queue.length === 0) {
    defer(flush)
  }
  queue.push({
    partialState,
    component,
  })
  if (!componentQueue.some((item) => item === component)) {
    componentQueue.push(component)
  }
}

function flush() {
  let item, component
  while ((item = queue.shift())) {
    const { partialState, component } = item

    // 如果没有prevState，则将当前的state作为初始的prevState
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state)
    }

    // 如果partialState是一个方法，也就是setState的第二种形式
    if (typeof partialState === 'function') {
      Object.assign(component.state, partialState(component.prevState, component.props))
    } else {
      // 如果partialState是一个对象，则直接合并到setState中
      Object.assign(component.state, partialState)
    }

    component.prevState = component.state
  }
  while ((component = componentQueue.shift())) {
    component._update_()
  }
}

function defer(fn) {
  return Promise.resolve().then(fn)
}
