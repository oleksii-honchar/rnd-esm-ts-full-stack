import path from "path";
import { __dirname } from "scripts/esm-utils.ts";
import { blablo } from "blablo";

const logHeader = "[webpack:config:snippet] ".cyan;
blablo.log(logHeader, "loading ", "'Module'".white.bold).finish();

export const moduleConfig = (env: any = {}) => {
  return {
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.[tj]sx?$/,
          use: "source-map-loader",
        },
        {
          test: /\.[tj]sx?$/,
          loader: "esbuild-loader",
          options: {
            tsconfig: path.join(__dirname(), `./tsconfig.${env.TS_TARGET}.json`),
          },
          exclude: [/\.(spec|e2e|d)\.[tj]sx?$/],
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        },
        {
          test: /\.(jpe?g|png|svg|gif|cur)$/,
          exclude: /icons/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        },
        {
          test: /\.svg/,
          include: /icons/,
          use: [
            {
              loader: "svg-inline-loader",
              options: {
                removeSVGTagAttrs: false,
              },
            },
          ],
        },
      ],
      noParse: [/\.(spec|e2e|d)\.[tj]sx?$/, /LICENSE/, /README.md/],
    },
  };
};
