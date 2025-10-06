# 🚀 Jhasmany Portfolio - Full Stack Application

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)

Un portfolio completo de desarrollador Full Stack construido con Next.js (Frontend) y Node.js (Backend), completamente dockerizado para facilitar el despliegue.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🐳 Docker Setup](#-docker-setup)
- [🛠️ Instalación Manual](#️-instalación-manual)
- [🌐 Acceso a la Aplicación](#-acceso-a-la-aplicación)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Comandos Útiles](#-comandos-útiles)
- [🐛 Solución de Problemas](#-solución-de-problemas)
- [🤝 Contribución](#-contribución)

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   (Next.js)     │◄──►│   (Node.js)     │
│   Port: 3000    │    │   Port: 3001    │
└─────────────────┘    └─────────────────┘
```

- **Frontend**: Next.js 15.1.7 con TypeScript y Tailwind CSS
- **Backend**: Node.js con Express.js
- **Containerización**: Docker & Docker Compose
- **Base de Datos**: Configurable (actualmente sin BD)

## ⚡ Inicio Rápido

### Prerrequisitos

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### 🚀 Instalación en 3 pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/jhasmany-portfolio.git
cd jhasmany-portfolio
```

2. **Ejecutar script de instalación**

**Windows:**
```cmd
install-windows.bat
```

**Linux/macOS:**
```bash
chmod +x install-linux.sh
./install-linux.sh
```

3. **¡Listo!** 🎉
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🐳 Docker Setup

### Instalación Automática

Los scripts de instalación verifican automáticamente Docker y lo instalan si es necesario.

### Instalación Manual de Docker

**Ubuntu/Debian:**
```bash
# Actualizar paquetes
sudo apt update

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker
```

**Windows:**
1. Descargar [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Instalar y reiniciar
3. Habilitar WSL2 si se solicita

**macOS:**
1. Descargar [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Instalar arrastrando a Applications

### Comandos Docker

```bash
# Construir y levantar servicios
docker compose up --build -d

# Ver estado de contenedores
docker compose ps

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f frontend
docker compose logs -f backend

# Parar servicios
docker compose down

# Parar y eliminar volúmenes
docker compose down -v

# Reconstruir sin caché
docker compose build --no-cache
docker compose up -d
```

## 🛠️ Instalación Manual

Si prefieres no usar Docker, puedes instalar manualmente:

### Frontend (Next.js)

```bash
cd Portfolio-Jhasmany-Frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

### Backend (Node.js)

```bash
cd Portfolio-Jhasmany-Backend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar en producción
npm start
```

## 🌐 Acceso a la Aplicación

### URLs por Defecto

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Demo**: http://localhost:3001/api/portfolio

### Acceso desde WSL2 (Windows)

Si usas WSL2, obtén la IP con:
```bash
hostname -I
```

Luego accede desde Windows:
- Frontend: `http://[WSL2-IP]:3000`
- Backend: `http://[WSL2-IP]:3001`

## 📂 Estructura del Proyecto

```
jhasmany-portfolio/
├── 📁 Portfolio-Jhasmany-Frontend/    # Aplicación Next.js
│   ├── 📁 src/                        # Código fuente
│   ├── 📁 public/                     # Archivos estáticos
│   ├── 🐳 Dockerfile                  # Configuración Docker Frontend
│   ├── 📦 package.json                # Dependencias Frontend
│   └── ⚙️ next.config.ts             # Configuración Next.js
├── 📁 Portfolio-Jhasmany-Backend/     # API Node.js
│   ├── 📄 index.js                    # Servidor principal
│   ├── 🐳 Dockerfile                  # Configuración Docker Backend
│   └── 📦 package.json                # Dependencias Backend
├── 🐳 docker-compose.yml              # Orquestación de servicios
├── 🚀 install-windows.bat             # Script instalación Windows
├── 🚀 install-linux.sh                # Script instalación Linux
└── 📖 README.md                       # Esta documentación
```

## 🔧 Comandos Útiles

### Docker Management

```bash
# Ver imágenes Docker
docker images

# Eliminar imágenes no utilizadas
docker image prune

# Ver uso de espacio
docker system df

# Limpiar todo el sistema Docker
docker system prune -a

# Acceder al contenedor frontend
docker compose exec frontend sh

# Acceder al contenedor backend
docker compose exec backend sh
```

### Desarrollo

```bash
# Instalar nueva dependencia en frontend
docker compose exec frontend npm install <package>

# Ejecutar tests (si están configurados)
docker compose exec frontend npm test
docker compose exec backend npm test

# Ver variables de entorno
docker compose exec frontend env
docker compose exec backend env
```

### Monitoreo

```bash
# Estadísticas de contenedores en tiempo real
docker stats

# Inspeccionar red de Docker
docker network ls
docker network inspect rd-nextjs-portfolio-template-main_portfolio-network

# Ver procesos en contenedores
docker compose top
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### ❌ "ERR_CONNECTION_REFUSED"

**Causa**: Los contenedores no están ejecutándose o hay problemas de red.

**Solución**:
```bash
# Verificar estado
docker compose ps

# Si no están corriendo
docker compose up -d

# Ver logs para errores
docker compose logs -f
```

#### ❌ "Port already in use"

**Causa**: Los puertos 3000 o 3001 están ocupados.

**Solución**:
```bash
# Ver qué proceso usa el puerto
netstat -tlnp | grep :3000
lsof -i :3000

# Terminar proceso si es necesario
kill -9 <PID>

# O cambiar puertos en docker-compose.yml
```

#### ❌ "Docker not found"

**Causa**: Docker no está instalado o no está en PATH.

**Solución**:
- Ejecutar scripts de instalación automática
- Instalar Docker manualmente desde [docker.com](https://www.docker.com/)
- Verificar que Docker esté en PATH

#### ❌ WSL2 - No acceso desde Windows

**Causa**: Problema de red entre WSL2 y Windows.

**Solución**:
```bash
# Obtener IP de WSL2
hostname -I

# Usar IP específica desde Windows
# http://172.x.x.x:3000
```

### Logs y Debugging

```bash
# Ver todos los logs
docker compose logs

# Logs de un servicio específico
docker compose logs frontend
docker compose logs backend

# Seguir logs en tiempo real
docker compose logs -f --tail=100

# Ver logs con timestamps
docker compose logs -t
```

### Reset Completo

Si tienes problemas persistentes:

```bash
# Parar y eliminar todo
docker compose down -v --rmi all

# Limpiar sistema Docker
docker system prune -a

# Reconstruir desde cero
docker compose up --build -d
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Jhasmany Fernandez**
- Portfolio: [Tu Portfolio URL]
- LinkedIn: [Tu LinkedIn]
- Email: [tu-email@example.com]

---

⭐ ¡Dale una estrella si este proyecto te ayudó!