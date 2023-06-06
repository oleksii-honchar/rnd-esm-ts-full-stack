/**
 * This wrapper allows to use ESM ts webpack configs in order to have esm style modules in whole repo
 */
import process from "node:process";

import webpack from "webpack";
import minimist from "minimist";
import colors from "colors";
import { blablo } from "blablo";
import * as emoji from "node-emoji";

import { setCurrMetaUrl } from "scripts/esm-utils.ts";
setCurrMetaUrl(import.meta.url);

import { configFactory } from "./webpack.config.ts";

colors.enable();
const logHeader = "[Webpack]".cyan.bold;
const emoSparkles: any = emoji.get(emoji.find("✨")?.key ?? "");
const argv = minimist(process.argv.slice(2));

const config = configFactory({}, process.argv.slice(2));

blablo.cleanLog(logHeader, "starting compilation", emoji.get(emoji.find("rocket")?.key ?? ""));

// @ts-ignore
const compiler = webpack(config);

const compilerPromise = new Promise((resolve, reject) => {
  let errors: any[] = [];
  compiler.run((err, stats) => {
    if (err) {
      blablo.error(err);
      errors.push(err);
    }

    const info = stats?.toJson();
    if (stats?.hasErrors()) {
      blablo.error(info?.errors);
      errors.push(info?.errors);
    }
    !!stats?.hasWarnings() && blablo.warn(info?.warnings);

    compiler.close((closeErr) => {
      if (closeErr) {
        blablo.error(closeErr);
        errors.push(closeErr);
      }
      if (errors.length) {
        return reject(errors);
      }
      resolve(stats);
    });
  });
});

try {
  await compilerPromise;
} catch (e) {}

blablo.cleanLog(logHeader, `Done ${emoSparkles}`);

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
