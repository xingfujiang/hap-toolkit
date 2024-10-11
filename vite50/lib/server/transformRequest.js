const fs = require("fs-extra");
async function transformRequest(url, server) {
  const { pluginContainer } = server;

  const { id } = await pluginContainer.resolveId(url);

  const loadResult = await pluginContainer.load(id);

  let code;

  if (loadResult) {
    code = loadResult.code;
  } else {
    let fsPath = id.split("?")[0];
    code = await fs.readFile(fsPath, "utf8");
  }

  await server.moduleGraph.ensureEntryFromUrl(url);

  const result = await pluginContainer.transform(code, id);

  return result;
}

module.exports = transformRequest;
