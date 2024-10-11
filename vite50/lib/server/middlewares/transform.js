const { isJSRequest } = require("../../utils");
const transformRequest = require("../transformRequest");
const send = require("../send");
function transformMiddleware(server) {
  return async function (req, res, next) {
    if (req.method !== "GET") return next();
    if (isJSRequest(req.url)) {
      const result = await transformRequest(req.url, server);
      if (result) {
        return send(req, res, result.code, "js");
      } else {
        return next();
      }
    } else {
      return next();
    }
  };
}

module.exports = transformMiddleware;
