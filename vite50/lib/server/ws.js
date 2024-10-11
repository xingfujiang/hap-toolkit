const { WebSocketServer } = require("ws");

function createWebSocketServer(httpServer) {
  const webSocketServer = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (req, client, head) => {
    if (req.headers["sec-websocket-protocol"] === "vite-hmr") {
      webSocketServer.handleUpgrade(req, client, head, (client) => {
        webSocketServer.emit("connection", client, req);
      });
    }
  });

  webSocketServer.on("connection", (client) => {
    client.send(JSON.stringify({ type: "connected" }));
  });
  return {
    on: webSocketServer.on.bind(webSocketServer),
    off: webSocketServer.off.bind(webSocketServer),
    send(payload) {
      const stringified = JSON.stringify(payload);
      webSocketServer.clients.forEach((client) => {
        client.send(stringified);
      });
    },
  };
}

exports.createWebSocketServer = createWebSocketServer;
