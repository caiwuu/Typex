import * as web from './web'
import context from './context'
const platform = {
  ...web,
}
platform.install = (plugins, core) => {
  context.core = core
  plugins.platform = web
  return platform.initIntercept
}
export default platform
