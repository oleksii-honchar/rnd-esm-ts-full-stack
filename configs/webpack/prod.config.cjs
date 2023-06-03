const logHeader = "[config:webpack:snippet]".cyan;
console.log(logHeader, "'Production' loaded");

module.exports = {
  mode: process.env.NODE_ENV,
};
