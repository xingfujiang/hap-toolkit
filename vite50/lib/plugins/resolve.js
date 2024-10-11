const pathLib = require("path");
const resolve = require("resolve");
const fs = require("fs-extra");

function resolvePlugin({ root }) {
  return {
    name: "resolve",
    resolveId(path, importer) {
      if (path.startsWith("/Users")) {
        return { id: path };
      }

      if (path.startsWith("/")) {
        return { id: pathLib.resolve(root, path.slice(1)) };
      }

      if (path.startsWith(".")) {
        const baseDir = importer ? pathLib.dirname(importer) : root;
        const fsPath = pathLib.resolve(baseDir, path);
        return { id: fsPath };
      }

      let res = tryNodeResolve(path, importer, root);
      if (res) return res;
    },
  };
}

function tryNodeResolve(path, importer, root) {
  const pkgPath = resolve.sync(`${path}/package.json`, { basedir: root });
  const pkgDir = pathLib.dirname(pkgPath);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const entryPoint = pkg.module;
  const entryPointPath = pathLib.join(pkgDir, entryPoint);
  return { id: entryPointPath };
}

module.exports = resolvePlugin;
