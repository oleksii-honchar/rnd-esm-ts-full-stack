import ExtractCssChunksPlugin from "extract-css-chunks-webpack-plugin";
import path from "path";
import { __dirname } from "scripts/esm-utils.ts";
import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet] ".cyan;
blablo.log(logHeader, "loading ", "'Module-CSS'".white.bold).finish();

const isProd = process.env.NODE_ENV === "production";

export const cssModuleConfig = (env: any) => {
  return {
    plugins: [
      new ExtractCssChunksPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          include: /src\/assets/,
          use: [
            {
              loader: ExtractCssChunksPlugin.loader,
              options: {
                hot: !isProd,
                reloadAll: !isProd,
                publicPath: "/assets/stylesheets/",
              },
            },
            "style-loader",
            {
              loader: "css-loader",
            },
          ],
        },
        {
          test: /\.p?css$/i,
          exclude: /src\/assets/,
          use: [
            "style-loader",
            {
              loader: ExtractCssChunksPlugin.loader,
              options: {
                hot: !isProd,
                reloadAll: !isProd,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: false, // true cause to obfuscation
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  ctx: {
                    "postcss-preset-env": {
                      stage: 3,
                      features: {
                        "nesting-rules": true,
                      },
                    },
                    cssnano: {
                      preset: [
                        "default",
                        {
                          discardComments: {
                            removeAll: true,
                          },
                        },
                      ],
                    },
                    env: process.env.NODE_ENV,
                  },
                  path: path.join(__dirname(), "./webpack/postcss.config.ts"),
                },
              },
            },
          ],
        },
      ],
    },
  };
};
