#!/bin/bash
# Script para ejecutar el proyecto en modo PRODUCCIÓN

echo "🚀 Iniciando Portfolio en MODO PRODUCCIÓN..."
echo ""
echo "Características:"
echo "  ✓ Build optimizado"
echo "  ✓ Mejor rendimiento"
echo "  ✓ Listo para internet"
echo ""

# Detener servicios de desarrollo si están corriendo
docker compose -f docker-compose.dev.yml down

# Iniciar servicios de producción
docker compose up --build -d

echo ""
echo "✅ Servicios en producción iniciados!"
echo ""
echo "URLs disponibles:"
echo "  - Frontend:  http://localhost:8000"
echo "  - Frontend:  http://192.168.0.19"
echo "  - Frontend:  http://181.114.111.21"
echo "  - API:       http://localhost:8001"
echo "  - HTTPS:     https://localhost:8443"
echo ""
echo "Ver logs:"
echo "  docker compose logs -f"
echo ""
echo "Detener producción:"
echo "  docker compose down"
echo ""
