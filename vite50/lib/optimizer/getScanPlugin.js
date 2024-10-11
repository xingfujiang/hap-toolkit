const htmlTypesRE = /\.html$/;
const fs = require("fs-extra");
const { normalizePath } = require("../utils");
const scriptModuleRE = /<script\s+type="module"\s+src="(.+?)">/;
const { createPluginContainer } = require("../server/pluginContainer");
const resolvePlugin = require("../plugins/resolve");

async function getScanPlugin(config, depImports) {
  const container = await createPluginContainer({
    plugins: [resolvePlugin(config)],
    root: config.root,
  });
  const resolve = async function (path, importer) {
    return await container.resolveId(path, importer);
  };
  return {
    name: "scan",
    setup(build) {
      build.onResolve({ filter: /\.vue$/ }, async ({ path: id, importer }) => {
        const resolved = await resolve(id, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            external: true,
          };
        }
      });
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          return {
            path: resolved.id || resolved,
            namespace: "html",
          };
        }
      });
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer);
        if (resolved) {
          const id = resolved.id || resolved;
          if (id.includes("node_modules")) {
            depImports[path] = normalizePath(id);
            return {
              path: id,
              external: true,
            };
          } else {
            return {
              path: id,
            };
          }
        }
      });
      build.onLoad({ filter: htmlTypesRE, namespace: "html" }, ({ path }) => {
        const html = fs.readFileSync(path, "utf8");
        let [, src] = html.match(scriptModuleRE);
        let jsContent = `import ${JSON.stringify(src)}`;
        return {
          contents: jsContent,
          loader: "js",
        };
      });
    },
  };
}

module.exports = getScanPlugin;
