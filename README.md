# 🚀 Jhasmany Portfolio - Full Stack Application

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-green.svg)](https://nginx.org/)

Portfolio completo de desarrollador Full Stack con Next.js, Node.js y Nginx, completamente dockerizado y accesible desde internet con HTTPS.

---

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [⚡ Inicio Rápido](#-inicio-rápido)
- [🌐 Acceso a la Aplicación](#-acceso-a-la-aplicación)
- [🐳 Configuración Docker](#-configuración-docker)
- [🌍 Configuración de Red (Internet)](#-configuración-de-red-internet)
- [🔒 HTTPS / SSL](#-https--ssl)
- [📂 Estructura del Proyecto](#-estructura-del-proyecto)
- [🔧 Comandos Útiles](#-comandos-útiles)
- [🐛 Solución de Problemas](#-solución-de-problemas)
- [📚 Documentación Adicional](#-documentación-adicional)

---

## 🏗️ Arquitectura

### Arquitectura de Servicios

```
┌──────────────────────────────────────────────────────────────┐
│                      DOCKER COMPOSE                          │
│  ┌────────────┐    ┌──────────────┐    ┌───────────────┐   │
│  │   Nginx    │◄──►│   Frontend   │    │    Backend    │   │
│  │  (Proxy)   │    │   (Next.js)  │◄──►│   (Node.js)   │   │
│  │   :80,:443 │    │     :3000    │    │     :3001     │   │
│  └────────────┘    └──────────────┘    └───────────────┘   │
│        ▲                                                      │
│        │  Expone: 8000 (HTTP), 8001 (API), 8443 (HTTPS)     │
└────────┼──────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│                       WSL2 DEBIAN                          │
│                    IP: 172.22.208.47                       │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│                  WINDOWS PORT PROXY                        │
│    80 → WSL2:8000  |  443 → WSL2:8443  |  8080 → WSL2:8001│
│                   IP: 192.168.0.19                         │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│                   ROUTER PORT FORWARDING                   │
│      80 → 192.168.0.19:80  |  443, 8080, 22               │
└────────┬───────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│                        INTERNET                            │
│                   IP: 181.114.111.21                       │
└────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

- **Frontend**: Next.js 15.1.7 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Reverse Proxy**: Nginx Alpine
- **Containerización**: Docker & Docker Compose
- **SSL/TLS**: Certificado autofirmado (desarrollo) / Let's Encrypt (producción)

---

## ⚡ Inicio Rápido

### Prerrequisitos

- WSL2 con Debian (Windows) o Linux nativo
- Docker & Docker Compose
- PowerShell (Windows)
- Acceso al router para port forwarding

### 🚀 Instalación Rápida

#### 1. Levantar Servicios Docker

```bash
cd ~/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker
docker compose up -d
```

#### 2. Verificar Estado

```bash
docker compose ps
./check-services.sh
```

#### 3. Configurar Port Forwarding (Windows)

En PowerShell como **Administrador**:

```powershell
cd C:\PortfolioSetup
.\actualizar-port-forwarding.ps1
```

#### 4. ¡Listo! 🎉

- **Local**: http://localhost:8000
- **Red local**: http://192.168.0.19
- **Internet**: http://181.114.111.21

---

## 🌐 Acceso a la Aplicación

### 📍 URLs Locales (WSL2)

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:8000 | Aplicación Next.js |
| Backend API | http://localhost:8001 | API REST |
| HTTPS Frontend | https://localhost:8443 | Frontend con SSL |

### 🏠 URLs Red Local (Windows/Dispositivos)

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://192.168.0.19 | Desde Windows/WiFi |
| Backend | http://192.168.0.19:8080 | API desde red local |
| HTTPS | https://192.168.0.19 | Con advertencia SSL |

### 🌍 URLs Públicas (Internet)

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend HTTP | http://181.114.111.21 | Acceso público |
| Backend API | http://181.114.111.21:8080 | API pública |
| HTTPS | https://181.114.111.21 | SSL autofirmado |

---

## 🐳 Configuración Docker

### Servicios Incluidos

#### Nginx (Reverse Proxy)
- **Puertos Expuestos**: 8000 (HTTP), 8001 (API), 8443 (HTTPS)
- **Función**: Proxy inverso para frontend y backend
- **Configuración**: `nginx/nginx.conf`
- **SSL**: Certificados en `nginx/ssl/`

#### Frontend (Next.js)
- **Puerto Interno**: 3000
- **Build**: Standalone output optimizado
- **Variables**: NODE_ENV=production, NEXT_TELEMETRY_DISABLED=1

#### Backend (Node.js)
- **Puerto Interno**: 3001
- **Health Check**: Habilitado
- **Variables**: NODE_ENV=production, PORT=3001

### Docker Compose

```yaml
services:
  nginx:      # Reverse Proxy
  frontend:   # Next.js App
  backend:    # Node.js API
```

### Comandos Docker Principales

```bash
# Levantar servicios
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Logs de servicio específico
docker compose logs -f nginx
docker compose logs -f frontend
docker compose logs -f backend

# Reiniciar servicios
docker compose restart

# Detener servicios
docker compose down

# Reconstruir desde cero
docker compose down
docker compose up --build -d

# Ver estado detallado
docker compose ps
```

---

## 🌍 Configuración de Red (Internet)

### Información de Red

| Componente | Valor | Descripción |
|------------|-------|-------------|
| IP Pública | 181.114.111.21 | IP estática del ISP |
| IP Windows | 192.168.0.19 | IP local del PC |
| IP WSL2 | 172.22.208.47 | IP interna de WSL2 |
| Red Local | 192.168.0.x | Rango DHCP |

### 1️⃣ Port Forwarding en Windows

El tráfico fluye: **Internet → Router → Windows → WSL2 → Docker**

**Script Automático (Recomendado):**

```powershell
# PowerShell como Administrador
cd C:\PortfolioSetup
.\actualizar-port-forwarding.ps1
```

**Manual:**

```powershell
$wsl_ip = (wsl hostname -I).Trim().Split()[0]

# Frontend (80 → 8000)
netsh interface portproxy add v4tov4 listenport=80 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wsl_ip

# Backend (8080 → 8001)
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8001 connectaddress=$wsl_ip

# HTTPS (443 → 8443)
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=8443 connectaddress=$wsl_ip

# Verificar
netsh interface portproxy show all
```

### 2️⃣ Firewall de Windows

```powershell
# Habilitar puertos en firewall
New-NetFirewallRule -DisplayName "Portfolio Frontend" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Portfolio Backend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Portfolio HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
```

### 3️⃣ Port Forwarding en Router

**Configuración en el Router:**

| Puerto Externo | IP Interna | Puerto Interno | Protocolo |
|----------------|------------|----------------|-----------|
| 80 | 192.168.0.19 | 80 | TCP |
| 8080 | 192.168.0.19 | 8080 | TCP |
| 443 | 192.168.0.19 | 443 | TCP |
| 22 | 192.168.0.19 | 22 | TCP |

**Acceso al Router:**
- URL: http://192.168.0.1 o http://181.114.111.1
- Sección: "Virtual Servers" o "Port Forwarding"

### 4️⃣ Verificación

```bash
# En WSL2 - Verificar servicios
./check-services.sh

# Verificar desde internet (datos móviles 4G)
# http://181.114.111.21
```

```powershell
# En PowerShell - Verificar configuración
.\diagnostico.ps1
.\verify-nginx-setup.ps1
```

---

## 🔒 HTTPS / SSL

### Certificado Autofirmado (Desarrollo)

**Ya configurado** con certificado SSL autofirmado válido por 365 días.

#### Ubicación de Certificados

```
nginx/ssl/
├── nginx-selfsigned.crt    # Certificado
└── nginx-selfsigned.key    # Llave privada
```

#### Habilitar HTTPS (PowerShell)

```powershell
cd C:\PortfolioSetup
.\habilitar-https.ps1
```

#### Acceso HTTPS

- **URL**: https://181.114.111.21
- **Advertencia**: El navegador mostrará "Conexión no privada"
- **Solución**: Click en "Avanzado" → "Continuar al sitio"

### Let's Encrypt (Producción)

Para certificado válido sin advertencias:

#### Prerrequisitos
- Dominio propio (ej: tuportfolio.com)
- DNS apuntando a 181.114.111.21

#### Instalación

```bash
# Instalar Certbot
sudo apt install certbot -y

# Detener Nginx temporal
docker compose stop nginx

# Obtener certificado
sudo certbot certonly --standalone -d tudominio.com

# Copiar certificados a nginx/ssl/
sudo cp /etc/letsencrypt/live/tudominio.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/tudominio.com/privkey.pem nginx/ssl/

# Actualizar nginx.conf con rutas nuevas
# Reiniciar Nginx
docker compose start nginx
```

### Cloudflare Tunnel (Alternativa)

Si no tienes dominio o el ISP bloquea puertos:

- ✅ HTTPS automático
- ✅ Sin port forwarding
- ✅ Dominio gratis (.trycloudflare.com)

Ver documentación en `C:\PortfolioSetup\HTTPS-CONFIGURADO.txt`

---

## 📂 Estructura del Proyecto

```
D.J.-Portfolio-Jhasmany-Docker/
├── 📁 Portfolio-Jhasmany-Frontend/    # Next.js Application
│   ├── src/                           # Código fuente
│   ├── public/                        # Archivos estáticos
│   ├── Dockerfile                     # Docker config
│   └── package.json                   # Dependencias
│
├── 📁 Portfolio-Jhasmany-Backend/     # Node.js API
│   ├── index.js                       # Servidor Express
│   ├── Dockerfile                     # Docker config
│   └── package.json                   # Dependencias
│
├── 📁 nginx/                          # Nginx Configuration
│   ├── nginx.conf                     # Config principal
│   └── ssl/                           # Certificados SSL
│       ├── nginx-selfsigned.crt
│       └── nginx-selfsigned.key
│
├── 🐳 docker-compose.yml              # Orquestación Docker
├── 📜 check-services.sh               # Script verificación
└── 📖 README.md                       # Esta documentación
```

---

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Levantar todo
docker compose up -d

# Ver estado
docker compose ps

# Logs en tiempo real
docker compose logs -f

# Reiniciar todo
docker compose restart

# Reiniciar servicio específico
docker compose restart nginx
docker compose restart frontend
docker compose restart backend

# Detener todo
docker compose down
```

### Debugging

```bash
# Entrar al contenedor nginx
docker compose exec nginx sh

# Entrar al contenedor frontend
docker compose exec frontend sh

# Entrar al contenedor backend
docker compose exec backend sh

# Ver configuración de nginx
docker compose exec nginx cat /etc/nginx/nginx.conf

# Verificar logs de nginx
docker compose logs nginx | tail -50

# Estadísticas en tiempo real
docker stats
```

### Verificación de Red

```bash
# En WSL2
./check-services.sh
hostname -I
ss -tulpn | grep -E ":(8000|8001|8443)"
curl http://localhost:8000
curl -k https://localhost:8443
```

```powershell
# En PowerShell
.\diagnostico.ps1
.\verify-nginx-setup.ps1
netsh interface portproxy show all
Get-NetFirewallRule -DisplayName "*Portfolio*"
```

### Mantenimiento

```bash
# Limpiar imágenes no utilizadas
docker image prune

# Limpiar todo el sistema Docker
docker system prune -a

# Ver espacio usado
docker system df

# Backup de configuración
tar -czf portfolio-backup.tar.gz nginx/ docker-compose.yml

# Actualizar imágenes
docker compose pull
docker compose up -d
```

---

## 🐛 Solución de Problemas

### ❌ No accesible desde Internet

**Síntomas:** Timeout desde datos móviles

**Verificar:**

```powershell
# 1. Servicios Docker corriendo
wsl docker compose ps

# 2. Port forwarding Windows
netsh interface portproxy show all

# 3. Firewall habilitado
Get-NetFirewallRule -DisplayName "*Portfolio*"

# 4. Prueba externa
# https://www.yougetsignal.com/tools/open-ports/
```

**Soluciones:**
1. ISP bloquea puerto 80 → Usar puerto 8888
2. Router no aplica cambios → Reiniciar router
3. CGNAT del ISP → Usar Cloudflare Tunnel

### ❌ HTTPS muestra advertencia

**Normal** con certificado autofirmado.

**Opciones:**
1. Aceptar advertencia: "Avanzado" → "Continuar"
2. Obtener certificado Let's Encrypt
3. Usar Cloudflare Tunnel

### ❌ Puerto ya en uso

```bash
# Ver qué usa el puerto
sudo ss -tulpn | grep :8000

# Terminar proceso
sudo kill -9 <PID>

# O cambiar puertos en docker-compose.yml
```

### ❌ IP de WSL2 cambia

**Problema:** La IP de WSL2 puede cambiar después de reiniciar.

**Solución:** Re-ejecutar script de port forwarding

```powershell
.\actualizar-port-forwarding.ps1
```

### ❌ Docker no inicia

```bash
# Verificar Docker
sudo service docker status

# Iniciar Docker
sudo service docker start

# Ver logs
sudo journalctl -u docker -n 50
```

---

## 📚 Documentación Adicional

### Scripts de PowerShell (C:\PortfolioSetup)

| Script | Descripción |
|--------|-------------|
| `actualizar-port-forwarding.ps1` | Configura port forwarding Windows → WSL2 |
| `habilitar-https.ps1` | Habilita HTTPS (puerto 443) |
| `diagnostico.ps1` | Diagnóstico completo de red |
| `verify-nginx-setup.ps1` | Verifica configuración completa |
| `test-port-external.ps1` | Prueba puertos desde internet |

### Guías Detalladas (C:\PortfolioSetup)

| Archivo | Contenido |
|---------|-----------|
| `NGINX-SETUP.txt` | Configuración completa con Nginx |
| `HTTPS-CONFIGURADO.txt` | Guía de HTTPS y certificados |
| `ROUTER-SETUP-GUIA.txt` | Configuración paso a paso del router |
| `SOLUCION-PROBLEMAS.txt` | Troubleshooting detallado |

### Scripts Bash (WSL2)

| Script | Descripción |
|--------|-------------|
| `check-services.sh` | Verifica servicios Docker y red |
| `~/scripts/server-control.sh` | Gestión de servicios del sistema |

---

## 🚀 Despliegue en Producción

### Checklist

- [ ] Cambiar a dominio propio
- [ ] Configurar Let's Encrypt
- [ ] Habilitar logs de producción
- [ ] Configurar monitoreo (Uptime Kuma, etc.)
- [ ] Habilitar backups automáticos
- [ ] Configurar rate limiting en Nginx
- [ ] Implementar CI/CD
- [ ] Configurar variables de entorno seguras

### Recomendaciones

1. **Dominio**: Registrar dominio propio (~$10/año)
2. **SSL**: Let's Encrypt o Cloudflare
3. **CDN**: Cloudflare (gratis)
4. **Monitoreo**: UptimeRobot o Pingdom
5. **Backups**: Programar backups diarios

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👨‍💻 Autor

**Jhasmany Fernandez**

- 🌐 Portfolio: http://181.114.111.21
- 📧 Email: jhasmany@example.com
- 💼 LinkedIn: [LinkedIn Profile]

---

## 📊 Estado del Servidor

### Servicios Activos

- ✅ Frontend Next.js (Docker)
- ✅ Backend Node.js (Docker)
- ✅ Nginx Reverse Proxy (Docker)
- ✅ HTTPS con SSL
- ✅ Accesible desde Internet

### Información Técnica

- **Servidor**: WSL2 Debian en Windows
- **IP Pública**: 181.114.111.21
- **Última Actualización**: 2025-10-06
- **Uptime**: Monitorizado 24/7

---

⭐ ¡Dale una estrella si este proyecto te ayudó!

🔗 **Acceso Público**: http://181.114.111.21
