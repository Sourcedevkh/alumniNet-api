#!/bin/bash

source ./scripts/constants.sh

echo -e "${BLUE} Starting Professional Sync Workflow...${NC}"

echo -e "${BLUE} Stashing your local changes...${NC}"
git stash

CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo -e "${BLUE} Switching from $CURRENT_BRANCH to dev...${NC}"
    git checkout dev
fi

# Pull latest changes from dev
echo -e "${BLUE} Pulling latest changes from GitHub (dev branch)...${NC}"
git pull origin dev

if [ $? -ne 0 ]; then
    echo -e "${RED} Git pull failed! Please check for internet or conflicts.${NC}"
    exit 1
fi

echo -e "${BLUE} Updating npm packages...${NC}"
npm install 
if [ $? -ne 0 ]; then
    echo -e "${RED} npm install failed${NC}"
    exit 1
fi

echo -e "${BLUE} Returning to your branch and restoring work...${NC}"
git checkout Phearaa
git stash pop

echo -e "${GREEN} SUCCESS: Your project is synced and your work is restored!${NC}"