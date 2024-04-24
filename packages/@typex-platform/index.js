import * as web from './web'
import coreContext from './coreContext'
const platform = {
  ...web,
}
platform.install = (pluginContext, core) => {
  coreContext.core = core
  pluginContext.platform = web
  return platform.initIntercept
}
export default platform
