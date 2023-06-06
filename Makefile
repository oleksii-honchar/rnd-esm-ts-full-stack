SHELL=/bin/bash
RED=\033[0;31m
GREEN=\033[0;32m
BG_GREY=\033[48;5;237m
NC=\033[0m # No Color

envFileLoc = "$(PWD)/configs/envs/local.env"
envFileProd = "$(PWD)/configs/envs/production.loc.env"

.PHONY: help

help:
	@echo automation commands:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

chmod-scripts:
	@chmod +x ./devops/local/scripts/chmod-scripts.sh
	@bash ./devops/local/scripts/chmod-scripts.sh
.PHONY: chmod-scripts

load-project-env:
	@. ./devops/local/scripts/load-project-env.sh
.PHONY: load-project-env

check-env-vars:
	@bash ./devops/local/scripts/check-env-vars.sh
.PHONY: check-env-vars

clean-dist:  ## Cleaning ./dist folder
	@printf "${RED}Cleaning ./dist folder:${NC}"
	@rm -rf ./dist
	@printf "${RED}DONE${NC}\n"
.PHONY: clean-dist

ts-node-config:
	@npx ts-node-esm --showConfig
.PHONY: ts-node-config

build: clean-dist load-project-env check-env-vars ## Build production version
	@printf "${BG_GREY}[build] Start${NC}\n"
	@source $(envFileProd)
	@npx env-cmd -f $(envFileProd) node --no-warnings --experimental-specifier-resolution=node \
		--loader ./scripts/ts-esm-loader-with-tsconfig-paths.js ./configs/webpack-wrapper.ts\
		--config ./configs/webpack.config.cjs \
		--mode production \
		--env BUILD_ANALYZE=$(BUILD_ANALYZE)

	@printf "${BG_GREY}[build] Done${NC}\n"

build-loc: clean-dist load-project-env check-env-vars ## Build local version
	@source $(envFileLoc)
	@npx env-cmd -f $(envFileLoc) node --no-warnings --experimental-specifier-resolution=node \
		--loader ./scripts/ts-esm-loader-with-tsconfig-paths.js ./configs/webpack-wrapper.ts\
		--config ./configs/webpack.config.cjs \
		--mode development \
		--env BUILD_ANALYZE=$(BUILD_ANALYZE)
	@printf "${GREEN}build-loc: Done${NC}\n"

launch-dev-server: load-project-env check-env-vars ## Launches local Webpack dev-server
	@npx env-cmd -f $(envFileLoc) "${PWD}/devops/local/scripts/check-env-vars.sh"
	@source ${envFileLoc}
	@npx env-cmd -f ${envFileLoc} webpack-dev-server \
		--config ./configs/webpack.config.cjs \
		--mode development \
		--env BUILD_ANALYZE=false \
		--open
