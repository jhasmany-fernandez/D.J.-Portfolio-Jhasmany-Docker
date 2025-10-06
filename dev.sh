#!/bin/bash
# Script para ejecutar el proyecto en modo DESARROLLO

echo "🚀 Iniciando Portfolio en MODO DESARROLLO..."
echo ""
echo "Características:"
echo "  ✓ Hot-reload automático"
echo "  ✓ Cambios en tiempo real"
echo "  ✓ No requiere reconstruir"
echo ""

# Detener servicios de producción si están corriendo
docker compose down

# Iniciar servicios de desarrollo
docker compose -f docker-compose.dev.yml up --build -d

echo ""
echo "✅ Servicios en desarrollo iniciados!"
echo ""
echo "URLs disponibles:"
echo "  - Frontend: http://localhost:8000"
echo "  - API:      http://localhost:8001"
echo "  - HTTPS:    https://localhost:8443"
echo ""
echo "Ver logs en tiempo real:"
echo "  docker compose -f docker-compose.dev.yml logs -f"
echo ""
echo "Detener desarrollo:"
echo "  docker compose -f docker-compose.dev.yml down"
echo ""
