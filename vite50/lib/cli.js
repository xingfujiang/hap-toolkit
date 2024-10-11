const { createServer } = require("./server");

(async function () {
  const server = await createServer();
  server.listen(8888, () => console.log("server started on 9999"));
})();
