import path from "path";
import { blablo } from "blablo";
import { __dirname } from "scripts/esm-utils.ts";

const logHeader = "[webpack:config:snippet] ".cyan;
blablo.log(logHeader, "loading ", "'DevServer'".white.bold).finish();

export const devServerConfig = (env: any) => {
  blablo.cleanLog(logHeader, `Base: processing "${env.TS_TARGET}" config`);

  return {
    devServer: {
      client: {
        logging: "info",
      },
      devMiddleware: {
        writeToDisk: true,
        publicPath: "/assets",
      },
      port: process.env.SERVE_PORT,
      static: path.join(__dirname(), "../dist"),
    },
  };
};
