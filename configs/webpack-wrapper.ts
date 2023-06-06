/**
 * This wrapper allows to use ESM ts webpack configs in order to have esm style modules in whole repo
 */
import process from "node:process";
import webpack from "webpack";
import minimist from "minimist";
import colors from "colors";
import * as emoji from "node-emoji";

import { blablo } from "blablo";
import { __dirname, setCurrMetaUrl } from "scripts/esm-utils.ts";
import path from "path";

setCurrMetaUrl(import.meta.url);

colors.enable();
const logHeader = "[Webpack]".cyan.bold;
const emoSparkles: any = emoji.get(emoji.find("✨")?.key ?? "");
const argv = {
  mode: "development",
  config: "./configs/webpack.config.ts",
  watch: false,
  ...minimist(process.argv.slice(2)),
};

// blablo.cleanLog(argv);
const operationMode = argv.watch ? "watch" : "build";
const cfgPath = path.join(__dirname(), "../", argv.config);
const { configFactory } = await import(cfgPath);
const config = configFactory({}, argv as any);

blablo.cleanLog(logHeader, `starting ${operationMode.white.bold}`, emoji.get(emoji.find("rocket")?.key ?? ""));

// @ts-ignore
const compiler = webpack(config);
let watching = undefined;

const compilerPromise = new Promise((resolve, reject) => {
  let errors: any[] = [];
  const operationCbFn = (err: any, stats: any) => {
    blablo.finish();
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

    blablo.cleanLog(
      stats.toString({
        chunks: true, // Makes the build much quieter
        colors: true, // Shows colors in the console
      }),
    );

    if (operationMode == "watch") {
      blablo.log(logHeader, " watching");
      return;
    }

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
  };

  if (operationMode === "build") {
    compiler.run(operationCbFn);
  } else if (operationMode === "watch") {
    watching = compiler.watch({ aggregateTimeout: 300, poll: undefined }, operationCbFn);
  }
});

try {
  await compilerPromise;
} catch (e) {
  if (operationMode === "watch" && watching) {
    // @ts-ignore
    watching.close((err: any) => {
      if (err) {
        blablo.error(err);
      }
    });
  }
}

blablo.cleanLog(logHeader, `Done ${emoSparkles}`);

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
