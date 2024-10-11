async function handleHMRUpdate(file, server) {
  const { moduleGraph, ws } = server;
  const updateModule = moduleGraph.getModuleById(file);
  if (updateModule) {
    const updtates = [];
    const boundaries = new Set();
    propagateUpdate(updateModule, boundaries);
    updtates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        type: `${boundary.type}-update`,
        path: boundary.url,
        acceptedPath: acceptedVia.url,
      }))
    );
    ws.send({
      type: "update",
      updtates,
    });
  }
}

const LexerState = {
  inCall: 0,
  inQuoteString: 1,
};

function propagateUpdate(updateModule, boundaries) {
  if (!updateModule.importers.size) return;
  for (const importerModule of updateModule.importers) {
    if (importerModule.acceptedHmrDeps.has(updateModule)) {
      boundaries.add({
        boundary: importerModule,
        acceptedVia: updateModule,
      });
    }
  }
}

async function lexAcceptedHmrDeps(code, start, acceptedUrls) {
  let state = LexerState.inCall;
  let currentDep = "";
  function addDep(index) {
    acceptedUrls.add({
      url: currentDep,
      start: index - currentDep.length - 1,
      end: index + 1,
    });
    currentDep = "";
  }
  for (let i = start; i < code.length; i++) {
    const char = code.charAt(i);
    switch (state) {
      case LexerState.inCall:
        if (char === `'` || char === `"`) {
          state = LexerState.inQuoteString;
        }
        break;
      case LexerState.inQuoteString:
        if (char === `'` || char === `"`) {
          addDep(i);
          state = LexerState.inCall;
        } else {
          currentDep += char;
        }
        break;
    }
  }
}

exports.lexAcceptedHmrDeps = lexAcceptedHmrDeps;
exports.handleHMRUpdate = handleHMRUpdate;
