import core from './core'
const pluginContext = {}
const usePlugin = (plugin) => {
  return plugin.install(pluginContext, core)
}
export { pluginContext, usePlugin }
export default pluginContext
