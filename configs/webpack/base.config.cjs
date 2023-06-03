const path = require("path");
const webpack = require("../webpack-wrapper.ts");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const TsConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const { PruneLicenseFilesInDist } = await import("./plugins/PruneLicenseFilesInDist.plugin.mjs");

const logHeader = "[config:webpack:snippet]".cyan;
console.log(logHeader,"'Base' loaded");

const outputPath = path.join(__dirname, "../../dist");
const pkg = require("../../package.json");

module.exports = (env) => {
  const outputSuff = env.TS_TARGET === "es2016" ? "es2016.js" : "mjs";

  console.log(logHeader,`'Base' processing '${env.TS_TARGET}' config`);

  return {
    mode: process.env.NODE_ENV,
    cache: true,
    devtool: process.env.NODE_ENV === "production" ? false : "inline-source-map",
    resolve: {
      extensions: [".js", ".jsx", ".html", ".ts", ".tsx", ".mjs", ".css", ".pcss"],
      modules: ["src", "node_modules"],
      plugins: [
        new TsConfigPathsPlugin({
          configFile: path.join(__dirname, `../tsconfig.${env.TS_TARGET}.json`),
          logLevel: "info",
        }),
      ],
    },
    output: {
      path: outputPath,
      filename: `[name].bundle.${outputSuff}`,
      chunkFilename: `[name].bundle.${outputSuff}`,
      sourceMapFilename: `[name].${env.TS_TARGET}.map`,
      publicPath: "/assets/",
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
      new LodashModuleReplacementPlugin(),
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
            globOptions: { ignore: ["**/*.hbs", "**/.DS_Store" ,"**/index.hbs"] },
          },
        ],
      }),
      new PruneLicenseFilesInDist(outputPath)
    ],
    node: false,
    watchOptions: {
      aggregateTimeout: 3000,
    },
  };
};
