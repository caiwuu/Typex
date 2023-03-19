const queue = []
const componentQueue = []

/**
 * @description state更新调度器
 * @export
 * @param {*} partialState
 * @param {*} component
 * @returns {*}  
 */
export default function enqueueSetState (partialState, component) {
  let deferPromise = null
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
  return deferPromise || Promise.resolve()
}

/**
 * @description 调度执行
 */
function flush () {
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
    component.syncUpdate()
  }
}

/**
 * @description defer
 * @param {function} fn
 * @returns {*}  
 */
function defer (fn) {
  return Promise.resolve().then(fn)
}
