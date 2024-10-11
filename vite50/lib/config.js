const { normalizePath } = require("./utils");
const path = require("path");
const { resolvePlugins } = require("./plugins");
const fs = require("fs-extra");

async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite50`));

  let config = { root, cacheDir };

  const configFile = path.resolve(root, "vite.config.js");

  const exists = await fs.pathExists(configFile);

  let userPlugins = [];

  if (exists) {
    const userConfig = require(configFile);
    userPlugins = userConfig.plugins || [];
    delete userConfig.plugins;
    config = { ...config, ...userConfig };
  }

  for (let plugin of userPlugins) {
    if (plugin.config) {
      let res = await plugin.config(config);
      if (res) {
        config = { ...config, ...res };
      }
    }
  }

  config.plugins = await resolvePlugins(config, userPlugins);

  return config;
}

module.exports = resolveConfig;
