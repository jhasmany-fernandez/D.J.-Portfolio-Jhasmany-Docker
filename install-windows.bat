@echo off
echo ===============================================
echo    Jhasmany Portfolio - Windows Installation
echo ===============================================
echo.

:: Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

:: Check if Docker Compose is available
docker compose version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose is not available
    echo Please ensure you have Docker Desktop with Compose support
    pause
    exit /b 1
)

echo Docker found! Starting installation...
echo.

:: Stop any running containers
echo Stopping existing containers...
docker compose down

:: Remove old images (optional - uncomment if needed)
:: echo Removing old images...
:: docker compose down --rmi all

:: Build and start services
echo Building and starting services...
docker compose up --build -d

if errorlevel 1 (
    echo ERROR: Failed to start services
    pause
    exit /b 1
)

echo.
echo ===============================================
echo          Installation Complete!
echo ===============================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo To view logs: docker compose logs -f
echo To stop:     docker compose down
echo ===============================================

pause