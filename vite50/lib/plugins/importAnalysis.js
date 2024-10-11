const { init, parse } = require("es-module-lexer");
const MagicString = require("magic-string");
const path = require("path");
const { normalizePath } = require("../utils");
const { lexAcceptedHmrDeps } = require("../server/hmr");

function importAnalysis(config) {
  const { root } = config;
  let server;
  return {
    name: "importAnalysis",
    configureServer(_server) {
      server = _server;
    },
    async transform(source, id) {
      debugger;
      await init;
      let imports = parse(source)[0];
      if (!imports.length) {
        return source;
      }
      const { moduleGraph } = server;
      const currentModule = moduleGraph.getModuleById(id);

      const importedUrls = new Set();

      const acceptedUrls = new Set();

      const ms = new MagicString(source);
      const normalizeUrl = async (url) => {
        const resolved = await this.resolve(url, id);
        if (resolved && resolved.id.startsWith(root)) {
          url = resolved.id.slice(root.length);
        }
        await moduleGraph.ensureEntryFromUrl(url);
        return url;
      };
      for (let index = 0; index < imports.length; index++) {
        const { s: start, e: end, n: specifier } = imports[index];
        const rawUrl = source.slice(start, end);
        if (rawUrl === "import.meta") {
          const prop = source.slice(end, end + 4);
          if (prop === ".hot") {
            if (source.slice(end + 4, end + 11) === ".accept") {
              await lexAcceptedHmrDeps(
                source,
                source.indexOf("(", end + 11) + 1,
                acceptedUrls
              );
            }
          }
        }
        if (specifier) {
          const normalizedUrl = await normalizeUrl(specifier);
          if (specifier !== normalizedUrl) {
            ms.overwrite(start, end, normalizedUrl);
          }
          importedUrls.add(normalizedUrl);
        }
      }
      const normalizedAcceptedUrls = new Set();
      const toAbsoluteUrl = (url) => {
        return path.posix.resolve(path.posix.dirname(currentModule.url), url);
      };
      for (const { url, start, end } of acceptedUrls) {
        const normalized = await normalizeUrl(toAbsoluteUrl(url));
        normalizedAcceptedUrls.add(normalized);
        ms.overwrite(start, end, JSON.stringify(normalized));
      }
      await moduleGraph.updateModuleInfo(
        currentModule,
        importedUrls,
        normalizedAcceptedUrls
      );
      console.log(importedUrls);
      console.log(normalizedAcceptedUrls);
      return ms.toString();
    },
  };
}

module.exports = importAnalysis;
