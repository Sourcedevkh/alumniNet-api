#!/bin/bash

source ./scripts/constants.sh

echo -e "${BLUE} Starting Database Migration...${NC}"

if [ -f "./database/migration.sql" ]; then
    echo -e "${BLUE} Updating database schema...${NC}"

    mysql -u $DB_USER -p $DB_NAME < ./database/migration.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN} Migration succeeded${NC}"
    else
        echo -e "${RED} Migration failed, Check SQL syntax${NC}"
    fi
else
    echo -e "${RED} Warning: migration.sql not found${NC}"
fi