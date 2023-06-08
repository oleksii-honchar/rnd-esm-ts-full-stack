# rnd-esm-ts-full-stack
R&amp;D for ESM TypeScript configuration for Node.js + Webpack based web-app

## Table of contents
- [TL;DR](#tldr)
- [Approach](#approach)
- [R&D Results](#rd-results)
  * [Crucial config for ESM](#crucial-config-for-esm)
- [Quick start](#quick-start)
- [Available commands](#available-commands)
  * [Alternative commands](#alternative-commands)
---

## TL;DR
With little additional configuration, ESM modules works perfectly both for node and for web-app code! Including multiple non-esm dependencies!

## Approach
- In order to get IDE properly resolve both node and web-app paths all of them added to the root `tsconfig.json`.
- Custom logger prototype `blablo` used for animated and colored logs.
- Separate environment configs stored in `./configs/envs/` taking into account future deployments. No sensitive values assumed!
- Webpack config used from my [ts-react-tmpl](https://github.com/oleksii-honchar/ts-react-tmpl) repo. Split into small chunks for easier customization. Custom `index.html` render approach used in order to inject additional data into html. 
- `esbuild-loader` was used to speed up build
- In general a lot of my personal snippets was added to r&d intentionally to increase complexity and test ESM approach in real situation

## R&D Results
- every `js` file was manually turned into `ts`
- [webpack-wrapper.ts](configs%2Fwebpack-wrapper.ts) was used to incapsulate common cli commands. It was made in order to have root webpack config in ts also.
- custom esm module loader was used to add ts path resolution
- [esm-utils.ts](scripts%2Fesm-utils.ts) mimic node global vars. Not sure if is good style. Additional r&d needed to find better native way

### Crucial config for ESM
- package.json:
```json
{
  "type": "module"
}
```
- tsconfig.json:
```json
{
  "ts-node": {
    "esm": true,
    "transpileOnly": true
  },
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "allowImportingTsExtensions": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "lib": [ "DOM","esnext"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "esnext",
    "types": ["node"]
  }
}
```
- [ts-esm-loader-with-tsconfig-paths.js](scripts%2Fts-esm-loader-with-tsconfig-paths.js) - is required for ts config path resolution

- node execution params
  - `--no-warnings` - optional - removes ESM warning
  - `--experimental-specifier-resolution=node` - mandatory
  - `--loader ./scripts/ts-esm-loader-with-tsconfig-paths.js` - `ts-node/esm` loader can be used instead, but no ts path will be resolved..
```bash
node --no-warnings --experimental-specifier-resolution=node --loader ./scripts/ts-esm-loader-with-tsconfig-paths.js /configs/webpack-wrapper.ts
```

## Quick start

```bash
nvm use 20
npm i
npm start
```
## Available commands

- `npm run start` = `npm run launch:loc` - starting Webpack dev server 
- `npm run build` - build prod bundle 
- `npm run build:loc` - build development bundle

### Alternative commands

`Makefile` used to describe all build commands with params. It's appears useful and convenient to keep them in one file and not to bloat `package.json`. Those command used in `package.json`. So the list of the `make` commands are the following:

- `make build`
- `make build-loc`
- `make launch-dev-server`
