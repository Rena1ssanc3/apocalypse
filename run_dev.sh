#!/bin/bash

# Apocalypse Development Environment Startup Script
# This script starts the application in development mode with H2 database

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Apocalypse Development Environment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Set development profile
export SPRING_PROFILES_ACTIVE=dev

echo -e "${GREEN}✓ Profile set to: ${SPRING_PROFILES_ACTIVE}${NC}"
echo ""

# Check if we need to clean and build
if [ "$1" == "--clean" ] || [ "$1" == "-c" ]; then
    echo -e "${BLUE}Cleaning and building project...${NC}"
    ./mvnw clean package -DskipTests
    echo ""
fi

# Start the application
echo -e "${GREEN}Starting Apocalypse application...${NC}"
echo ""
echo -e "${BLUE}Application will be available at:${NC}"
echo -e "  • API: ${GREEN}http://localhost:8080${NC}"
echo -e "  • Swagger UI: ${GREEN}http://localhost:8080/swagger-ui.html${NC}"
echo -e "  • H2 Console: ${GREEN}http://localhost:8080/h2-console${NC}"
echo -e "  • Health Check: ${GREEN}http://localhost:8080/actuator/health${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the application${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"
echo ""

# Run the application
./mvnw spring-boot:run
