function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

exports.normalizePath = normalizePath;

const knowJsSrcRE = /\.(js|vue)($|\?)/;
const isJSRequest = (url) => {
  return knowJsSrcRE.test(url);
};

exports.isJSRequest = isJSRequest;
