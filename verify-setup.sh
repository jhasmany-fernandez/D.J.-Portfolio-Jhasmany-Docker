#!/bin/bash

# Script de verificación del setup Docker
# Ejecuta este script para verificar que todo funciona correctamente

echo "🔍 Verificando setup de Jhasmany Portfolio..."
echo "================================================="

# Verificar Docker
echo "✅ Verificando Docker..."
if command -v docker >/dev/null 2>&1; then
    echo "   ✓ Docker está instalado: $(docker --version)"
else
    echo "   ❌ Docker no está instalado"
    exit 1
fi

# Verificar Docker Compose
echo "✅ Verificando Docker Compose..."
if docker compose version >/dev/null 2>&1; then
    echo "   ✓ Docker Compose está disponible: $(docker compose version)"
else
    echo "   ❌ Docker Compose no está disponible"
    exit 1
fi

# Verificar contenedores
echo "✅ Verificando contenedores..."
if docker compose ps | grep -q "Up"; then
    echo "   ✓ Contenedores están corriendo:"
    docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
else
    echo "   ⚠️  Los contenedores no están corriendo"
    echo "   Ejecutando: docker compose up -d"
    docker compose up -d
    sleep 5
fi

echo ""
echo "✅ Verificando conectividad..."

# Verificar Frontend
echo "🌐 Probando Frontend (puerto 3000)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    echo "   ✓ Frontend responde correctamente"
else
    echo "   ❌ Frontend no responde en puerto 3000"
fi

# Verificar Backend
echo "🔧 Probando Backend (puerto 3001)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health | grep -q "200"; then
    echo "   ✓ Backend responde correctamente"
    echo "   📊 Respuesta del health check:"
    curl -s http://localhost:3001/health | jq . 2>/dev/null || curl -s http://localhost:3001/health
else
    echo "   ❌ Backend no responde en puerto 3001"
fi

echo ""
echo "📋 Información del sistema:"
echo "   IP Local: $(hostname -I | awk '{print $1}')"
echo "   Fecha: $(date)"

echo ""
echo "🎯 URLs de acceso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"

# Si estamos en WSL2, mostrar IP
if grep -q Microsoft /proc/version 2>/dev/null; then
    WSL_IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "🔧 Acceso desde Windows (WSL2):"
    echo "   Frontend: http://$WSL_IP:3000"
    echo "   Backend:  http://$WSL_IP:3001"
fi

echo ""
echo "================================================="
echo "✅ Verificación completada!"
echo "================================================="