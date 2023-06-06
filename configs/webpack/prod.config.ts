import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet] ".cyan;
blablo.log(logHeader, "loading ", "'Production'".white.bold).finish();

export const prodConfig = {
  mode: process.env.NODE_ENV,
};
