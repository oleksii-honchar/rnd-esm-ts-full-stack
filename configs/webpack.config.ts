import { merge } from "webpack-merge";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import colors from "colors";
colors.enable();

// Short usage reference
// `NODE_ENV` = development | test | production
// `LOG_LEVEL` = error | warn | info | debug
import pkg from "package.json" assert { type: "json" };

import { baseConfig } from "./webpack/base.config.ts";
// import { moduleCfg } from "./webpack/module.config.ts";
// import { moduleCssCfg } from "./webpack/module-css.config.ts";
// const { devSrvCfg } from "./webpack/dev-server.config.ts";
// const { prodCfg } from "./webpack/prod.config.ts";
// const { externalsCfg } from "./webpack/externals.config.ts";
// const { GenerateIndexHTML } from "./webpack/plugins/GenerateIndexHTML.plugin.ts";

const logHeader = "[config:webpack]".cyan;
console.log(logHeader, `"${pkg.name}" config composition started`);

export const configFactory = (env: {}, argv: string[]) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  console.log(logHeader, `"${process.env.NODE_ENV}" mode used...`);

  const envES2022 = { ...env, TS_TARGET: "es2022" };

  let cfgES2022 = baseConfig(envES2022);
  // cfgES2022 = merge(cfgES2022, moduleCssCfg(env));
  // cfgES2022 = merge(cfgES2022, moduleCfg(envES2022));
  // cfgES2022 = merge(cfgES2022, externalsCfg);
  cfgES2022 = merge(cfgES2022, {
    entry: {
      app: "./src/index.es2022.tsx",
    },
    // plugins: [new GenerateIndexHTML(env)],
  });

  // if (argv.mode === "development") {
  //   cfgES2022 = merge(cfgES2022, devSrvCfg(envES2022));
  // }

  // if (env.BUILD_ANALYZE === "true") {
  //   console.log(logHeader, "bundle analyzer included");

  // cfgES2022 = merge(cfgES2022, {
  //   plugins: [new BundleAnalyzerPlugin(env)],
  // });
  // }

  if (process.env.NODE_ENV !== "production") {
    console.log("[config:webpack] config composition completed");
    // return [cfgES2022];
  }

  // for prod will add es2016 cfg
  const envES2016 = { ...env, TS_TARGET: "es2016" };
  // let cfgES2016 = baseConfig(envES2016);
  // cfgES2016 = merge(cfgES2016, moduleCfg(envES2016));
  // cfgES2016 = merge(cfgES2016, externalsCfg);
  // cfgES2016 = merge(cfgES2016, {
  //   entry: {
  //     app: "./src/index.es2016.tsx",
  //   },
  // });

  // let configs = [cfgES2022, cfgES2016];

  // configs = configs.map((cfg) => merge(cfg, prodCfg));

  console.log("[config:webpack]".cyan, "config composition completed");
  // return configs;
};
