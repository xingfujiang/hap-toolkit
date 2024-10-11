function preAlias() {
  let server;
  return {
    name: "preAlias",
    configureServer(_server) {
      server = _server;
    },
    resolveId(id) {
      const metadata = server._optimizeDepsMetadata;

      const isOptimized = metadata.optimized[id];

      if (isOptimized) {
        return {
          id: isOptimized.file,
        };
      }
    },
  };
}

module.exports = preAlias;
