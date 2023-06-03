const path = require("path");

const logHeader = "[config:webpack:snippet]".cyan;
console.log(logHeader, "DevServer loaded");

const pkg = require("../../package.json");

module.exports = (env) => {
  console.log(logHeader, `Base: processing "${env.TS_TARGET}" config`);

  return {
    devServer: {
      client: {
        logging: "info",
      },
      devMiddleware: {
        writeToDisk: true,
        publicPath: "/assets/",
      },
      port: process.env.SERVE_PORT,
      static: path.join(__dirname, "../../dist"),
    },
  };
};
