const { merge } = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const colors = require("colors");
colors.enable();

// Short usage reference
// `NODE_ENV` = development | test | production
// `LOG_LEVEL` = error | warn | info | debug
const generateIndexHtml = require("./webpack/libs/generateIndexHtml.cjs");
const pkg = require("../package.json");

const baseCfg = require("./webpack/base.config.cjs");
const moduleCfg = require("./webpack/module.config.cjs");
const moduleCssCfg = require("./webpack/module-css.config.cjs");
const devSrvCfg = require("./webpack/dev-server.config.cjs");
const prodCfg = require("./webpack/prod.config.cjs");
const externalsCfg = require("./webpack/externals.config.cjs");
const { GenerateIndexHTML}  = require("./webpack/plugins/GenerateIndexHTML.plugin.cjs");

const logHeader = "[config:webpack]".cyan;
console.log(logHeader, `"${pkg.name}" config composition started`);

module.exports = (env, argv) => {
  env = env ? env : {};
  env.BUILD_ANALYZE = env.BUILD_ANALYZE ? env.BUILD_ANALYZE : null;

  console.log(logHeader, `"${process.env.NODE_ENV}" mode used...`);

  const envES2022 = { ...env, TS_TARGET: "es2022" };

  let cfgES2022 = baseCfg(envES2022);
  cfgES2022 = merge(cfgES2022, moduleCssCfg(env));
  cfgES2022 = merge(cfgES2022, moduleCfg(envES2022));
  cfgES2022 = merge(cfgES2022, externalsCfg);
  cfgES2022 = merge(cfgES2022, {
    entry: {
      app: "./src/index.es2022.tsx",
    },
    plugins: [new GenerateIndexHTML(env)]
  });

  if (argv.mode === "development") {
    cfgES2022 = merge(cfgES2022, devSrvCfg(envES2022));
  }

  if (env.BUILD_ANALYZE === "true") {
    console.log(logHeader,"bundle analyzer included");

    cfgES2022 = merge(cfgES2022, {
      plugins: [new BundleAnalyzerPlugin(env)],
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[config:webpack] config composition completed");
    return [cfgES2022];
  }

  // for prod will add es2016 cfg
  const envES2016 = { ...env, TS_TARGET: "es2016" };
  let cfgES2016 = baseCfg(envES2016);
  cfgES2016 = merge(cfgES2016, moduleCfg(envES2016));
  cfgES2016 = merge(cfgES2016, externalsCfg);
  cfgES2016 = merge(cfgES2016, {
    entry: {
      app: "./src/index.es2016.tsx",
    },
  });

  let configs = [cfgES2022, cfgES2016];

  configs = configs.map((cfg) => merge(cfg, prodCfg));

  console.log("[config:webpack]".cyan, "config composition completed");
  return configs;
};
