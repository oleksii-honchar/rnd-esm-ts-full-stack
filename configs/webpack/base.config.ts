import path from "path";
import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
// @ts-ignore
import LoaderOptionsPlugin from "webpack/lib/LoaderOptionsPlugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import { __dirname } from "scripts/esm-utils.ts";
import { blablo } from "blablo";

const { PruneLicenseFilesInDist } = await import("./plugins/PruneLicenseFilesInDist.plugin.ts");

const logHeader = "[webpack:config:snippet]".cyan;
blablo.log(logHeader, " loading ", "'Base'".white.bold).finish();

const outputPath = path.join(__dirname(), "../dist/assets");
import pkg from "package.json" assert { type: "json" };

export const baseConfig = (env: any = {}) => {
  const outputSuff = env.TS_TARGET === "es2016" ? "es2016.js" : "mjs";

  blablo.cleanLog(logHeader, `'Base' processing '${env.TS_TARGET}' config`);

  return {
    stats: { chunks: false },
    mode: process.env.NODE_ENV,
    cache: true,
    devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
    resolve: {
      extensions: [".js", ".jsx", ".html", ".ts", ".tsx", ".mjs", ".css", ".pcss"],
      modules: ["src", "node_modules"],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: path.join(__dirname(), `./tsconfig.${env.TS_TARGET}.json`),
          logLevel: "INFO",
        }),
      ],
    },
    output: {
      path: outputPath,
      filename: `[name].bundle.${outputSuff}`,
      chunkFilename: `[name].bundle.${outputSuff}`,
      sourceMapFilename: `[name].${env.TS_TARGET}.map`,
      publicPath: "/assets",
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL),
          PKG_NAME: JSON.stringify(pkg.name),
          PKG_VERSION: JSON.stringify(pkg.version),
        },
      }),
      new LoaderOptionsPlugin({
        debug: process.env.NODE_ENV !== "production",
        minimize: process.env.NODE_ENV === "production",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./src/assets",
            to: ".",
            globOptions: { ignore: ["**/*.hbs", "**/.DS_Store", "**/index.hbs", "**/favicons/**"] },
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "./src/assets/favicons",
            to: "../favicons",
          },
        ],
      }),
      new PruneLicenseFilesInDist(outputPath),
    ],
    node: false,
    watchOptions: {
      poll: 3000,
      aggregateTimeout: 3000,
    },
  };
};
