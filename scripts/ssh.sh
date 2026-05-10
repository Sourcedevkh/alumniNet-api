#!/bin/bash

source ./scripts/constants.sh

function show_help() {
    echo -e "${BLUE}Available commands:${NC}"
    echo "Usage: ./scripts/ssh.sh [flag/command]"
    echo ""
    echo "Flags:"
    echo "  -h, --help - Show this help message"
    echo ""
    echo "  setup    - Install dependencies and create .env"
    echo "  db-reset - Drop and recreate database from schema.sql"
    echo "  clean    - Remove node_modules and logs"
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

case "$1" in
    "setup")
        echo -e "${GREEN}Installing dependencies...${NC}"
        npm install
        if [ ! -f .env ]; then
            cp .env.example .env
            echo " Created .env file"
        fi
        ;;
        
    "db-reset")
        echo -e "${RED}  Resetting Database: $DB_NAME${NC}"

        # Check if shcema.sql exists
        if [ ! -f ./database/schema.sql ]; then
            echo -e "${RED} schema.sql not found!${NC}"
            exit 1
        fi

        mysql -u $DB_USER -p -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME;"
        mysql -u $DB_USER -p $DB_NAME < ./database/schema.sql
        echo -e "${GREEN} Database refreshed!${NC}"
        ;;
        
    "clean")
        echo -e "${BLUE}Cleaning project...${NC}"
        rm -rf node_modules package-lock.json
        echo " node_modules removed"
        ;;
        
    *)
        show_help
        ;;
esac