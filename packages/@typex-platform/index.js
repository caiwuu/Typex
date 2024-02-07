import * as web from './web'
import coreContext from './coreContext'
const platform = {
  ...web,
}
// console.log(web,'============');
platform.install = (pluginContext, core) => {
  coreContext.core = core
  pluginContext.platform = web
  return platform.initIntercept
}
export default platform
