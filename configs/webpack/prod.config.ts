import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet]".cyan;
blablo.cleanLog(logHeader, "'Production' loaded");

export const prodConfig = {
  mode: process.env.NODE_ENV,
};
