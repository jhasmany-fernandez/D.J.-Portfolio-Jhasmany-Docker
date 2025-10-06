# Configuración de Red para Exponer Portfolio

## Configuración Actual
- **IP Pública**: 181.114.111.21
- **IP Windows**: 192.168.0.19
- **IP WSL2**: 172.22.208.47
- **Frontend Docker**: puerto 3003
- **Backend Docker**: puerto 3002

## Objetivo
Exponer la aplicación en:
- Frontend: http://181.114.111.21
- Backend/API: http://181.114.111.21:8080

---

## Opción 1: Usando Apache como Reverse Proxy (RECOMENDADO)

### Paso 1: Configurar Apache en Windows

1. **Habilitar módulos necesarios** en `httpd.conf`:
   ```apache
   LoadModule proxy_module modules/mod_proxy.so
   LoadModule proxy_http_module modules/mod_proxy_http.so
   LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
   LoadModule headers_module modules/mod_headers.so
   ```

2. **Copiar configuración**:
   - Copiar `apache-portfolio.conf` a `C:\Apache24\conf\extra\`
   - Agregar al final de `httpd.conf`:
     ```apache
     Include conf/extra/apache-portfolio.conf
     ```

3. **Reiniciar Apache**:
   ```powershell
   Restart-Service Apache2.4
   ```

### Paso 2: Configurar Firewall de Windows

Abrir PowerShell como Administrador y ejecutar:
```powershell
# Permitir puerto 80 (HTTP)
netsh advfirewall firewall add rule name="HTTP Portfolio" dir=in action=allow protocol=TCP localport=80

# Permitir puerto 8080 (Apache API)
netsh advfirewall firewall add rule name="HTTP Apache" dir=in action=allow protocol=TCP localport=8080
```

### Paso 3: Configurar Port Forwarding en el Router

En tu router (generalmente en http://192.168.0.1):

1. Ir a **Port Forwarding** o **Virtual Server**
2. Agregar reglas:
   - Puerto Externo: **80** → IP Interna: **192.168.0.19**, Puerto Interno: **80**
   - Puerto Externo: **8080** → IP Interna: **192.168.0.19**, Puerto Interno: **8080**

### Paso 4: Verificar

1. Desde Windows: http://192.168.0.19
2. Desde red local: http://192.168.0.19
3. Desde internet: http://181.114.111.21

---

## Opción 2: Port Forwarding Directo (Sin Apache)

### Paso 1: Ejecutar Script de PowerShell

En Windows, abrir PowerShell como **Administrador**:
```powershell
cd "\\wsl.localhost\Ubuntu\home\jhasmany\Repository-Docker\D.J.-Portfolio-Jhasmany-Docker"
.\setup-port-forwarding.ps1
```

Este script:
- Detecta automáticamente la IP de WSL2
- Configura port forwarding de Windows → WSL2
- Configura reglas de firewall

### Paso 2: Configurar Router

En tu router:
- Puerto Externo: **80** → IP Interna: **192.168.0.19**, Puerto Interno: **3003**
- Puerto Externo: **8080** → IP Interna: **192.168.0.19**, Puerto Interno: **3002**

---

## Solución de Problemas

### 1. Verificar que Docker esté corriendo
```bash
docker compose ps
```

### 2. Verificar puertos desde WSL2
```bash
curl http://localhost:3003
curl http://localhost:3002
```

### 3. Verificar desde Windows
```powershell
curl http://172.22.208.47:3003
curl http://172.22.208.47:3002
```

### 4. Verificar Port Forwarding en Windows
```powershell
netsh interface portproxy show v4tov4
```

### 5. Verificar Firewall
```powershell
netsh advfirewall firewall show rule name=all | findstr "Portfolio\|Apache\|WSL"
```

### 6. Reiniciar WSL si la IP cambia
Cada vez que reinicies Windows, la IP de WSL2 puede cambiar. Si usas Opción 2, re-ejecuta el script de PowerShell.

---

## Comandos Útiles

### Detener Port Forwarding (Opción 2)
```powershell
netsh interface portproxy delete v4tov4 listenport=3002 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=3003 listenaddress=0.0.0.0
```

### Ver logs de Apache
```powershell
Get-Content C:\Apache24\logs\portfolio-error.log -Tail 50 -Wait
```

### Reiniciar servicios Docker
```bash
docker compose restart
```

---

## Recomendación

**Usar Opción 1 (Apache)** porque:
- Permite usar puerto 80 estándar (http://181.114.111.21)
- Más fácil agregar SSL/HTTPS después
- Mejor manejo de logs y errores
- No depende de scripts que se ejecuten al reiniciar
