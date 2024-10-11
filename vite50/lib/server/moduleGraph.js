class ModuleNode {
  importers = new Set();
  acceptedHmrDeps = new Set();
  constructor(url, type = "js") {
    this.url = url;
    this.type = type;
  }
}

class ModuleGraph {
  constructor(resolveId) {
    this.resolveId = resolveId;
  }

  idToModuleMap = new Map();
  getModuleById(id) {
    return this.idToModuleMap.get(id);
  }

  async ensureEntryFromUrl(rawUrl) {
    const [url, resolveId] = await this.resolveUrl(rawUrl);

    let moduleNode = this.idToModuleMap.get(resolveId);

    if (!moduleNode) {
      moduleNode = new ModuleNode(url);
      this.idToModuleMap.set(resolveId, moduleNode);
    }
    return moduleNode;
  }

  async resolveUrl(url) {
    const resolved = await this.resolveId(url);
    return [url, resolved.id || resolved];
  }

  async updateModuleInfo(importerModule, importedUrls, acceptedUrls) {
    for (const importedUrl of importedUrls) {
      const depModule = await this.ensureEntryFromUrl(importedUrl);
      depModule.importers.add(importerModule);
    }
    const acceptedHmrDeps = importerModule.acceptedHmrDeps;
    for (const acceptedUrl of acceptedUrls) {
      const acceptedModule = await this.ensureEntryFromUrl(acceptedUrl);
      acceptedHmrDeps.add(acceptedModule);
    }
  }
}

exports.ModuleGraph = ModuleGraph;
