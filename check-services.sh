#!/bin/bash

echo "========================================"
echo "   VERIFICACION DE SERVICIOS DOCKER"
echo "========================================"
echo ""

# Obtener IPs
WSL_IP=$(ip addr show eth0 | grep "inet " | awk '{print $2}' | cut -d/ -f1)
echo "IP WSL2: $WSL_IP"
echo ""

# Verificar servicios Docker
echo "Estado de contenedores:"
docker compose ps
echo ""

# Verificar puertos
echo "Puertos en escucha:"
ss -tulpn | grep -E ":(8000|8001)" || echo "No se encontraron puertos 8000/8001"
echo ""

# Probar servicios
echo "Probando servicios..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000)
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001)

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✓ Frontend (8000): OK - HTTP $FRONTEND_STATUS"
else
    echo "✗ Frontend (8000): ERROR - HTTP $FRONTEND_STATUS"
fi

if [ "$BACKEND_STATUS" = "404" ] || [ "$BACKEND_STATUS" = "200" ]; then
    echo "✓ Backend (8001): OK - HTTP $BACKEND_STATUS"
else
    echo "✗ Backend (8001): ERROR - HTTP $BACKEND_STATUS"
fi

echo ""
echo "========================================"
echo "   SERVICIOS DISPONIBLES"
echo "========================================"
echo ""
echo "Desde WSL2:"
echo "  Frontend: http://localhost:8000"
echo "  Backend:  http://localhost:8001"
echo ""
echo "Desde Windows:"
echo "  Frontend: http://$WSL_IP:8000"
echo "  Backend:  http://$WSL_IP:8001"
echo ""
echo "Desde red local (192.168.0.19):"
echo "  Requiere configurar port forwarding en Windows"
echo ""
echo "Desde internet (181.114.111.21):"
echo "  Requiere configurar port forwarding en router"
echo ""
echo "========================================"
