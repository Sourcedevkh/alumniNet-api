#!/bin/bash

#set color
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'


if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN} .env loaded${NC}"
else
    echo -e "${RED} .env not found${NC}"
fi
