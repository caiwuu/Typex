import core from './core'
const pluginContext = {}
const initPlugin = (plugins) => {
  for (let index = 0; index < plugins.length; index++) {
    const plugin = plugins[index]
    plugin.install(pluginContext, core)
  }
}
export { pluginContext, initPlugin }
export default pluginContext
