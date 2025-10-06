#!/bin/bash
# Script para verificar la configuración de red y servicios

echo "===================================="
echo "   VERIFICACIÓN DE CONFIGURACIÓN"
echo "===================================="
echo ""

# Obtener IPs
WSL_IP=$(ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1)
echo "✓ IP WSL2: $WSL_IP"

# Verificar servicios Docker
echo ""
echo "Docker Services:"
docker compose ps

# Verificar puertos locales
echo ""
echo "Verificando puertos locales..."
if curl -s http://localhost:3003 > /dev/null; then
    echo "✓ Frontend (3003): OK"
else
    echo "✗ Frontend (3003): ERROR"
fi

if curl -s http://localhost:3002 > /dev/null; then
    echo "✓ Backend (3002): OK"
else
    echo "✗ Backend (3002): ERROR"
fi

# Mostrar puertos en escucha
echo ""
echo "Puertos en escucha:"
ss -tulpn | grep -E ":(3002|3003)" || echo "No se encontraron puertos 3002/3003"

# Información para configuración
echo ""
echo "===================================="
echo "   INFORMACIÓN PARA CONFIGURACIÓN"
echo "===================================="
echo "Configura Apache o Port Forwarding con:"
echo "  - IP WSL2: $WSL_IP"
echo "  - Frontend: $WSL_IP:3003"
echo "  - Backend: $WSL_IP:3002"
echo ""
echo "Servicios expuestos (después de config):"
echo "  - Frontend: http://181.114.111.21"
echo "  - Backend: http://181.114.111.21:8080"
echo "===================================="
