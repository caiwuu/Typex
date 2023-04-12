import core from './core'
const pluginContext = {}
const usePlugin = (plugins) => {
  for (let index = 0; index < plugins.length; index++) {
    const plugin = plugins[index]
    plugin.install(pluginContext, core)
  }
}
export { pluginContext, usePlugin }
export default pluginContext
