# 🚀 Inicio Rápido - Configuración Apache

## TL;DR - Solo 4 comandos

Abre PowerShell como **Administrador** y ejecuta:

```powershell
# 1. Ir a la carpeta del proyecto
cd "\\wsl.localhost\Ubuntu\home\jhasmany\Repository-Docker\D.J.-Portfolio-Jhasmany-Docker"

# 2. Detectar y configurar Apache automáticamente
.\1-detect-apache.ps1
.\2-configure-apache.ps1
.\3-configure-firewall.ps1

# 3. Reiniciar Apache
Restart-Service Apache2.4

# 4. Verificar que todo funcione
.\4-test-configuration.ps1
```

## ✅ Si todo está bien verás:

```
✓ TODO CONFIGURADO CORRECTAMENTE

Servicios disponibles:
  • Frontend: http://localhost
  • Backend:  http://localhost:8080
```

## 🌐 Último paso: Configurar Router

1. Accede a tu router: http://192.168.0.1
2. Ve a **Port Forwarding** / **Virtual Server**
3. Agrega:
   - Puerto 80 → 192.168.0.19:80
   - Puerto 8080 → 192.168.0.19:8080

## 🎉 Listo!

Tu portfolio estará en:
- **http://181.114.111.21** (Frontend)
- **http://181.114.111.21:8080** (Backend)

---

Para más detalles, consulta: [INSTALACION-APACHE.md](./INSTALACION-APACHE.md)
