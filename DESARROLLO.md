# 🚀 Guía de Desarrollo

## 📋 Modos de Ejecución

### Modo DESARROLLO (Recomendado para programar)

**Características:**
- ✅ Hot-reload automático
- ✅ Cambios se ven instantáneamente
- ✅ No requiere reconstruir
- ✅ Editas en VSCode y se actualiza automáticamente

**Iniciar desarrollo:**
```bash
cd ~/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker
./dev.sh
```

O manualmente:
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Ver logs:**
```bash
docker compose -f docker-compose.dev.yml logs -f
```

**Detener:**
```bash
docker compose -f docker-compose.dev.yml down
```

---

### Modo PRODUCCIÓN (Para internet)

**Características:**
- ✅ Build optimizado
- ✅ Mejor rendimiento
- ✅ Listo para usuarios reales
- ❌ Requiere reconstruir para ver cambios

**Iniciar producción:**
```bash
cd ~/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker
./prod.sh
```

O manualmente:
```bash
docker compose up --build -d
```

**Ver logs:**
```bash
docker compose logs -f
```

**Detener:**
```bash
docker compose down
```

---

## 🛠️ Flujo de Trabajo Recomendado

### 1. **Desarrollo Diario (Programar)**

```bash
# Iniciar modo desarrollo
./dev.sh

# Abrir VSCode
code .

# Hacer cambios en el código
# Los cambios se ven automáticamente en:
# - http://localhost:8000
# - http://192.168.0.19

# Ver logs si hay errores
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f backend
```

### 2. **Probar en Producción (Antes de publicar)**

```bash
# Cambiar a modo producción
./prod.sh

# Verificar que todo funciona
# http://localhost:8000
# http://181.114.111.21

# Si todo está bien, dejarlo corriendo
# Si hay problemas, volver a desarrollo
./dev.sh
```

---

## ✏️ Editar Código con Hot-Reload

### Frontend (Next.js)

```bash
# Archivos que puedes editar:
cd Portfolio-Jhasmany-Frontend/src/

# Componentes
src/components/Hero/Hero.tsx
src/components/Navbar/Navbar.tsx
# ... etc

# Estilos
src/app/globals.css
tailwind.config.ts

# Los cambios se ven instantáneamente
```

### Backend (Node.js)

```bash
# Archivos que puedes editar:
cd Portfolio-Jhasmany-Backend/

# API
index.js
src/routes/
src/controllers/

# Nodemon reinicia automáticamente
```

---

## 🔄 Cambiar entre Modos

```bash
# De desarrollo a producción
docker compose -f docker-compose.dev.yml down
./prod.sh

# De producción a desarrollo
docker compose down
./dev.sh
```

---

## 📁 Archivos Importantes

| Archivo | Uso |
|---------|-----|
| `docker-compose.yml` | Configuración PRODUCCIÓN |
| `docker-compose.dev.yml` | Configuración DESARROLLO |
| `Dockerfile` | Build PRODUCCIÓN |
| `Dockerfile.dev` | Build DESARROLLO |
| `dev.sh` | Script inicio desarrollo |
| `prod.sh` | Script inicio producción |

---

## ⚠️ Notas Importantes

1. **No uses ambos modos al mismo tiempo** - Siempre detén uno antes de iniciar el otro
2. **Desarrollo usa más recursos** - Es normal que consuma más CPU/RAM
3. **Producción es más rápido** - Pero requiere rebuild para ver cambios
4. **Git ignora .env** - No subas secrets al repositorio

---

## 🐛 Solución de Problemas

### Los cambios no se ven

```bash
# Reiniciar servicio específico
docker compose -f docker-compose.dev.yml restart frontend

# O reconstruir
docker compose -f docker-compose.dev.yml up --build -d
```

### Puertos en uso

```bash
# Detener TODO
docker compose down
docker compose -f docker-compose.dev.yml down

# Verificar puertos
ss -tulpn | grep -E ":(8000|8001|8443)"
```

### Contenedor no inicia

```bash
# Ver logs completos
docker compose -f docker-compose.dev.yml logs frontend
docker compose -f docker-compose.dev.yml logs backend

# Ver estado
docker compose -f docker-compose.dev.yml ps
```

---

## 🎯 Resumen Rápido

**Desarrollo diario:**
```bash
./dev.sh
code .
# Edita código, cambios automáticos
```

**Publicar a internet:**
```bash
./prod.sh
# Accesible en http://181.114.111.21
```

**Ver logs:**
```bash
# Desarrollo
docker compose -f docker-compose.dev.yml logs -f

# Producción
docker compose logs -f
```
