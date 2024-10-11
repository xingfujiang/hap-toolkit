const path = require("path");
const { build } = require("esbuild");
const getScanPlugin = require("./getScanPlugin");

async function scanImports(config) {
  const depImports = {};
  const scanPlugin = await getScanPlugin(config, depImports);
  await build({
    absWorkingDir: config.root,
    entryPoints: [path.resolve("./index.html")],
    bundle: true,
    format: "esm",
    outfile: "./dist/bundle.js",
    write: false,
    plugins: [scanPlugin],
  });
  return depImports;
}

module.exports = scanImports;
