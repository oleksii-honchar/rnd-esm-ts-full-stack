#!/usr/bin/env bash

BLUE='\033[0;34m'
LBLUE='\033[1;36m'
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

file=${1:-'project.env'}
if [ -f $file ]; then
    printf "Gonna load root project.env file ";
    source $file;

    if [ $? -eq 0 ]; then
        printf "${GREEN}[Ok]${NC}\n";
    else
        printf "${RED}[Error]${NC}\n";
        exit 1;
    fi
else
    printf "${RED}No ${file} file found in: ${NC}$PWD\n"
    exit 1;
fi

echo "";