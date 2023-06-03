const logHeader = "[webpack:config:snippet]".cyan;
console.log(logHeader, "'Production' loaded");

module.exports = {
  mode: process.env.NODE_ENV,
};
