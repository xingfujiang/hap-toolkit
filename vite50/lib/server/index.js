const connect = require("connect");
const serveStaticMiddleware = require("./middlewares/static");
const resolveConfig = require("../config");
const { createOptimizeDepsRun } = require("../optimizer");
const transformMiddleware = require("./middlewares/transform");
const { createPluginContainer } = require("./pluginContainer");
const { createWebSocketServer } = require("./ws");
const chokidar = require("chokidar");
const path = require("path");
const { normalizePath } = require("../utils");
const { handleHMRUpdate } = require("./hmr");
const { ModuleGraph } = require("./moduleGraph");

async function createServer() {
  const config = await resolveConfig();
  const middlewares = connect();
  const httpServer = require("http").createServer(middlewares);
  const ws = createWebSocketServer(httpServer, config);
  const watcher = chokidar.watch(path.resolve(config.root), {
    ignored: ["**/node_modules/**", "**/.git/**"],
  });
  const moduleGraph = new ModuleGraph((url) => pluginContainer.resolveId(url));
  const pluginContainer = await createPluginContainer(config);
  const server = {
    pluginContainer,
    ws,
    watcher,
    moduleGraph,
    async listen(port, callback) {
      //在项目启动前进行依赖的预构建
      // 1.找到本项目依赖的第三方模块
      await runOptimize(config, server);
      httpServer.listen(port, callback);
    },
  };
  watcher.on("change", async (file) => {
    const normalizeFile = normalizePath(file);
    await handleHMRUpdate(normalizeFile, server);
  });
  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      plugin.configureServer(server);
    }
  }
  middlewares.use(transformMiddleware(server));
  middlewares.use(serveStaticMiddleware(config));
  return server;
}

async function runOptimize(config, server) {
  const optimizeDeps = await createOptimizeDepsRun(config);

  server._optimizeDepsMetadata = optimizeDeps.metadata;
}

exports.createServer = createServer;
