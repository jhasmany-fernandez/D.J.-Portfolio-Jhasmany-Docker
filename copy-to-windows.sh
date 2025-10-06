#!/bin/bash
# Script para copiar archivos de configuración a Windows

echo "======================================"
echo "  Copiando scripts a Windows"
echo "======================================"
echo ""

# Crear directorio en Windows
WINDOWS_DIR="/mnt/c/PortfolioSetup"
mkdir -p "$WINDOWS_DIR"

# Copiar scripts PowerShell
echo "Copiando scripts PowerShell..."
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/1-detect-apache.ps1 "$WINDOWS_DIR/"
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/2-configure-apache.ps1 "$WINDOWS_DIR/"
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/3-configure-firewall.ps1 "$WINDOWS_DIR/"
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/4-test-configuration.ps1 "$WINDOWS_DIR/"

# Copiar configuración de Apache
echo "Copiando configuración de Apache..."
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/apache-portfolio.conf "$WINDOWS_DIR/"

# Copiar documentación
echo "Copiando documentación..."
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/INICIO-RAPIDO.md "$WINDOWS_DIR/"
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/INSTALACION-APACHE.md "$WINDOWS_DIR/"
cp /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/CONFIGURACION-RED.md "$WINDOWS_DIR/"

echo ""
echo "✓ Archivos copiados exitosamente!"
echo ""
echo "======================================"
echo "  SIGUIENTE PASO"
echo "======================================"
echo "En PowerShell de Windows, ejecuta:"
echo ""
echo "  cd C:\\PortfolioSetup"
echo "  .\\1-detect-apache.ps1"
echo ""
echo "======================================"
