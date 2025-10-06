# Guía de Instalación: Exponer Portfolio con Apache

Esta guía te ayudará a exponer tu portfolio dockerizado en tu IP pública (181.114.111.21) usando Apache como reverse proxy.

## 📋 Prerequisitos

- ✅ Docker Desktop con servicios corriendo en WSL2 (Ya configurado)
- ⚠️ Apache instalado en Windows
- ⚠️ Acceso administrador en Windows
- ⚠️ Acceso al router para configurar port forwarding

---

## 🚀 Proceso de Instalación (Automatizado)

He creado 4 scripts de PowerShell que automatizan todo el proceso:

### **Script 1: Detectar Apache**
Detecta automáticamente dónde está instalado Apache en tu sistema.

```powershell
cd "\\wsl.localhost\Ubuntu\home\jhasmany\Repository-Docker\D.J.-Portfolio-Jhasmany-Docker"
.\1-detect-apache.ps1
```

**Qué hace:**
- Busca Apache en rutas comunes (C:\Apache24, XAMPP, WAMP, etc.)
- Verifica que los archivos de configuración existan
- Guarda la ruta para los siguientes scripts

---

### **Script 2: Configurar Apache**
Configura automáticamente Apache para actuar como reverse proxy.

```powershell
.\2-configure-apache.ps1
```

**Qué hace:**
- ✅ Crea backup de tu configuración actual
- ✅ Habilita módulos necesarios (proxy, proxy_http, headers)
- ✅ Configura Listen en puerto 8080
- ✅ Copia la configuración de VirtualHost
- ✅ Verifica que la configuración sea válida
- ⚠️ Revierte cambios si hay errores

**Módulos habilitados:**
- `mod_proxy.so` - Proxy básico
- `mod_proxy_http.so` - Proxy HTTP
- `mod_headers.so` - Manejo de headers

**VirtualHosts configurados:**
- Puerto 80: Frontend (Next.js) → http://172.22.208.47:3003
- Puerto 8080: Backend (API) → http://172.22.208.47:3002

---

### **Script 3: Configurar Firewall**
Configura el firewall de Windows para permitir tráfico entrante.

```powershell
.\3-configure-firewall.ps1
```

**Qué hace:**
- ✅ Habilita puerto 80 (HTTP Frontend)
- ✅ Habilita puerto 8080 (Backend API)
- ✅ Habilita puerto 443 (HTTPS futuro)
- ✅ Verifica que las reglas estén activas

---

### **Script 4: Verificar Configuración**
Prueba toda la configuración y muestra el estado.

```powershell
.\4-test-configuration.ps1
```

**Qué hace:**
- ✅ Verifica servicios Docker en WSL2
- ✅ Verifica estado de Apache
- ✅ Verifica puertos abiertos
- ✅ Prueba conectividad a cada servicio
- ✅ Muestra resumen completo

---

## 📝 Instrucciones Paso a Paso

### 1️⃣ Abrir PowerShell como Administrador

**Opción A:**
1. Presiona `Windows + X`
2. Selecciona "Windows PowerShell (Admin)" o "Terminal (Admin)"

**Opción B:**
1. Busca "PowerShell" en el menú inicio
2. Click derecho → "Ejecutar como administrador"

---

### 2️⃣ Navegar a la carpeta del proyecto

```powershell
cd "\\wsl.localhost\Ubuntu\home\jhasmany\Repository-Docker\D.J.-Portfolio-Jhasmany-Docker"
```

> **Nota:** Si tu usuario de WSL es diferente, cambia `jhasmany` por tu usuario.

---

### 3️⃣ Ejecutar scripts en orden

```powershell
# Paso 1: Detectar Apache
.\1-detect-apache.ps1

# Paso 2: Configurar Apache
.\2-configure-apache.ps1

# Paso 3: Configurar Firewall
.\3-configure-firewall.ps1

# Paso 4: Reiniciar Apache
Restart-Service Apache2.4
# O si el nombre del servicio es diferente:
# Get-Service Apache* | Restart-Service

# Paso 5: Verificar todo
.\4-test-configuration.ps1
```

---

### 4️⃣ Verificar acceso local

Abre un navegador y prueba:

✅ **Frontend:** http://localhost
✅ **Backend API:** http://localhost:8080
✅ **Desde red local:** http://192.168.0.19

---

### 5️⃣ Configurar Router (Port Forwarding)

Para acceder desde internet, necesitas configurar tu router:

1. **Accede a tu router:**
   - Generalmente: http://192.168.0.1
   - Usuario/Contraseña: Verifica la etiqueta del router

2. **Busca la sección de Port Forwarding:**
   - Puede llamarse: "Port Forwarding", "Virtual Server", "NAT", etc.

3. **Agrega estas reglas:**

   | Puerto Externo | Puerto Interno | IP Interna    | Protocolo | Descripción       |
   |----------------|----------------|---------------|-----------|-------------------|
   | 80             | 80             | 192.168.0.19  | TCP       | Portfolio Frontend|
   | 8080           | 8080           | 192.168.0.19  | TCP       | Portfolio API     |
   | 443            | 443            | 192.168.0.19  | TCP       | HTTPS (futuro)    |

4. **Guarda y aplica cambios**

5. **Verifica desde internet:**
   - http://181.114.111.21 (Frontend)
   - http://181.114.111.21:8080 (Backend)

---

## 🔍 Verificación y Pruebas

### Desde Windows (local):
```powershell
# Frontend
Invoke-WebRequest http://localhost

# Backend
Invoke-WebRequest http://localhost:8080
```

### Desde red local (otro dispositivo):
- http://192.168.0.19
- http://192.168.0.19:8080

### Desde internet:
- http://181.114.111.21
- http://181.114.111.21:8080

---

## 🛠️ Solución de Problemas

### ❌ Error: "Apache no encontrado"

**Solución:** Instala Apache primero
```powershell
# Descarga Apache desde:
# https://www.apachelounge.com/download/

# O instala XAMPP:
# https://www.apachelounge.com/
```

---

### ❌ Error: "Puerto 80 ya está en uso"

**Solución 1:** Detén el proceso que usa el puerto
```powershell
# Ver qué está usando el puerto 80
Get-NetTCPConnection -LocalPort 80

# Detener IIS si está corriendo
Stop-Service W3SVC -ErrorAction SilentlyContinue
```

**Solución 2:** Cambia el puerto de Apache
- Edita `httpd.conf`
- Cambia `Listen 80` a `Listen 8000`
- Actualiza el port forwarding del router

---

### ❌ Error: "Syntax error on line X"

**Solución:** El script creó backup automático
```powershell
# Verifica el error
cd C:\Apache24\bin  # o tu ruta de Apache
.\httpd.exe -t

# Si necesitas restaurar backup:
cd C:\Apache24\conf
dir httpd.conf.backup-*
# Copia el backup más reciente
copy httpd.conf.backup-YYYYMMDD-HHMMSS httpd.conf
```

---

### ❌ Apache no inicia

**Verificar logs:**
```powershell
Get-Content C:\Apache24\logs\error.log -Tail 50
```

**Problemas comunes:**
- Puerto 80 ocupado por IIS o Skype
- Configuración con errores de sintaxis
- Falta la carpeta `logs/`

---

### ❌ No puedo acceder desde internet

**Checklist:**
1. ✅ Apache está corriendo en Windows
2. ✅ Firewall de Windows permite puertos 80 y 8080
3. ✅ Funciona localmente (http://localhost)
4. ✅ Funciona en red local (http://192.168.0.19)
5. ⚠️ Port forwarding configurado en router
6. ⚠️ ISP no bloquea puerto 80

**Probar puerto específico:**
```powershell
# Desde otra red o usando tu celular (4G/5G):
# http://181.114.111.21
```

**Si tu ISP bloquea puerto 80:**
- Usa puerto alternativo (ej: 8888)
- Configura router: 8888 → 192.168.0.19:80
- Accede con: http://181.114.111.21:8888

---

## 📂 Archivos Generados

```
D.J.-Portfolio-Jhasmany-Docker/
├── docker-compose.yml                # Configuración Docker
├── apache-portfolio.conf             # VirtualHost de Apache
├── INSTALACION-APACHE.md            # Este archivo
├── CONFIGURACION-RED.md             # Documentación de red
├── 1-detect-apache.ps1              # Script 1: Detectar Apache
├── 2-configure-apache.ps1           # Script 2: Configurar Apache
├── 3-configure-firewall.ps1         # Script 3: Configurar Firewall
├── 4-test-configuration.ps1         # Script 4: Verificar todo
└── network-check.sh                 # Script de verificación WSL2
```

---

## 🔐 Configuración SSL/HTTPS (Futuro)

Una vez que todo funcione con HTTP, puedes agregar HTTPS:

### Opción 1: Let's Encrypt (Gratis)
```bash
# Instalar Certbot en Windows
# https://certbot.eff.org/
```

### Opción 2: Certificado autofirmado
```powershell
# Generar certificado para desarrollo
# Ver documentación de OpenSSL
```

---

## 📊 Arquitectura Final

```
Internet (181.114.111.21)
    ↓
Router (Port Forwarding)
    ↓ :80 → :80
    ↓ :8080 → :8080
Windows (192.168.0.19)
    ↓
Apache (Reverse Proxy)
    ↓ :80 → :3003
    ↓ :8080 → :3002
WSL2 (172.22.208.47)
    ↓
Docker Compose
    ├── Frontend (Next.js) :3003
    └── Backend (Node.js) :3002
```

---

## 📞 Comandos Útiles

### Ver estado de Apache
```powershell
Get-Service Apache*
```

### Reiniciar Apache
```powershell
Restart-Service Apache2.4
```

### Ver logs de Apache
```powershell
Get-Content C:\Apache24\logs\error.log -Tail 50 -Wait
```

### Ver servicios Docker
```bash
# En WSL2
cd ~/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker
docker compose ps
docker compose logs -f
```

### Verificar puertos
```powershell
Get-NetTCPConnection -State Listen | Where-Object {$_.LocalPort -in @(80,8080,3002,3003)}
```

---

## ✅ Checklist Final

- [ ] Apache instalado en Windows
- [ ] Scripts ejecutados sin errores
- [ ] Apache corriendo (puerto 80 y 8080)
- [ ] Docker corriendo en WSL2 (puertos 3002 y 3003)
- [ ] Firewall configurado
- [ ] Acceso local funciona (http://localhost)
- [ ] Acceso en red local funciona (http://192.168.0.19)
- [ ] Port forwarding configurado en router
- [ ] Acceso desde internet funciona (http://181.114.111.21)

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu portfolio debería estar accesible en:
- **http://181.114.111.21** (Frontend)
- **http://181.114.111.21:8080** (Backend API)

Para mantener los servicios corriendo después de reiniciar:
1. Apache se inicia automáticamente (si está como servicio)
2. Docker Desktop debe estar configurado para iniciar con Windows
3. Los contenedores se reinician automáticamente (`restart: unless-stopped`)
