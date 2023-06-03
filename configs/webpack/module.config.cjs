const path = require("path");
const logHeader = "[config:webpack:snippet]".cyan;
console.log(logHeader,"'Module' loaded");

module.exports = (env) => {
  return {
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.[tj]sx?$/,
          use: "source-map-loader",
        },
        // {
        //   test: /\.[tj]sx?$/,
        //   loader: "ts-loader",
        //   options: {
        //     transpileOnly: true,
        //     configFile: path.join(__dirname, `../tsconfig.${env.TS_TARGET}.json`),
        //   },
        //   exclude: [/\.(spec|e2e|d)\.[tj]sx?$/],
        // },
        {
          test: /\.[tj]sx?$/,
          loader: "esbuild-loader",
          options: {
            tsconfig: path.join(__dirname, `../tsconfig.${env.TS_TARGET}.json`),
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
