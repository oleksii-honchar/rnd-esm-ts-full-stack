#!/usr/bin/env bash
BLUE='\033[0;34m'
LBLUE='\033[1;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW=$(tput setaf 3)
NC='\033[0m' # No Color

function chmodFile () {
    if [ ! -f ${1} ]; then
        printf "${YELLOW}${1} not found${NC}\n";
        return
    fi

    printf "chmod +x ${1}";

    if chmod +x ${1}; then
        printf " ${GREEN}[OK]${NC}\n";
    else
        printf " ${RED}[Error]${NC}\n";
    fi
}

printf "${LBLUE}Gonna make local scripts executable ...${NC}\n";

currDir="$(pwd)"
printf "Base dir: $currDir\n";

printf "${GREEN}./devops/local/scripts/${NC}\n";
chmodFile ./devops/local/scripts/check-env-vars.sh
chmodFile ./devops/local/scripts/load-project-env.sh

#printf "${GREEN}./scripts/${NC}\n";
#chmodFile ./scripts/build.sh
#chmodFile ./scripts/build.loc.sh
#chmodFile ./scripts/deploy-to-cdn.sh
#chmodFile ./scripts/launch.dev-server.sh
#chmodFile ./scripts/watch.loc.sh

printf "${LBLUE}Done${NC}\n";
