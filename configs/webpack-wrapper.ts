/**
 * This wrapper allows to use ESM ts webpack configs in order to have esm style modules in whole repo
 */
import process from "node:process";

import * as webpack from "./webpack-wrapper.js";
import minimist from "minimist";
import colors from "colors";
import { blablo } from "blablo";
import * as emoji from "node-emoji";

colors.enable();
const logHeader = "[Webpack]".cyan;
const emoSparkles: any = emoji.get(emoji.find("✨")?.key ?? "");
const argv = minimist(process.argv.slice(2));

blablo.cleanLog("\u2500".repeat(108).white);
blablo.cleanLog(logHeader, "starting webpack");

blablo.cleanLog(argv);
blablo.cleanLog(process.argv);
// const compiler = webpack({
// });

// compiler.run((err, stats) => {
//
// compiler.close((closeErr) => {
// });
// });

blablo.cleanLog(logHeader, `Done ${emoSparkles}`);

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
