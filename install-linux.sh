#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}    Jhasmany Portfolio - Linux Installation${NC}"
echo -e "${BLUE}===============================================${NC}"
echo

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
    echo -e "${RED}ERROR: Docker is not installed${NC}"
    echo -e "${YELLOW}Installing Docker...${NC}"

    # Detect OS
    if [[ -f /etc/debian_version ]]; then
        # Debian/Ubuntu
        sudo apt-get update
        sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif [[ -f /etc/redhat-release ]]; then
        # CentOS/RHEL/Fedora
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    else
        echo -e "${RED}Unsupported OS. Please install Docker manually from: https://docs.docker.com/get-docker/${NC}"
        exit 1
    fi

    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker

    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo -e "${YELLOW}Please log out and log back in for Docker group changes to take effect${NC}"
    echo -e "${YELLOW}Or run: newgrp docker${NC}"
fi

# Check if Docker Compose is available
if ! command_exists "docker compose"; then
    echo -e "${RED}ERROR: Docker Compose is not available${NC}"
    echo -e "${YELLOW}Please ensure Docker Compose plugin is installed${NC}"
    exit 1
fi

echo -e "${GREEN}Docker found! Starting installation...${NC}"
echo

# Make sure Docker service is running
if ! sudo systemctl is-active --quiet docker; then
    echo -e "${YELLOW}Starting Docker service...${NC}"
    sudo systemctl start docker
fi

# Stop any running containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose down 2>/dev/null || true

# Remove old images (optional - uncomment if needed)
# echo -e "${YELLOW}Removing old images...${NC}"
# docker compose down --rmi all

# Build and start services
echo -e "${YELLOW}Building and starting services...${NC}"
if docker compose up --build -d; then
    echo
    echo -e "${GREEN}===============================================${NC}"
    echo -e "${GREEN}          Installation Complete!${NC}"
    echo -e "${GREEN}===============================================${NC}"
    echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
    echo -e "${GREEN}Backend:  http://localhost:3001${NC}"
    echo
    echo -e "${BLUE}To view logs: docker compose logs -f${NC}"
    echo -e "${BLUE}To stop:     docker compose down${NC}"
    echo -e "${GREEN}===============================================${NC}"
else
    echo -e "${RED}ERROR: Failed to start services${NC}"
    echo -e "${YELLOW}Check the logs with: docker compose logs${NC}"
    exit 1
fi