# Script para solucionar problemas de red WSL2 -> Windows
# Ejecutar como Administrador

Write-Host "=== Solucionando problemas de red WSL2 ===" -ForegroundColor Cyan

# Obtener IP de WSL2
$wsl_ip = (wsl hostname -I).Trim().Split()[0]
Write-Host "IP WSL2: $wsl_ip" -ForegroundColor Yellow

# 1. Reiniciar WSL (esto recrea la interfaz de red)
Write-Host "`n1. Reiniciando WSL..." -ForegroundColor Yellow
wsl --shutdown
Start-Sleep -Seconds 3

# 2. Obtener nueva IP
$wsl_ip = (wsl hostname -I).Trim().Split()[0]
Write-Host "   Nueva IP WSL2: $wsl_ip" -ForegroundColor Green

# 3. Limpiar y reconfigurar port forwarding
Write-Host "`n2. Reconfigurando Port Forwarding..." -ForegroundColor Yellow
netsh interface portproxy reset

# Agregar reglas
netsh interface portproxy add v4tov4 listenport=80 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wsl_ip
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=8443 connectaddress=$wsl_ip
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8001 connectaddress=$wsl_ip

Write-Host "   Port forwarding configurado" -ForegroundColor Green

# 4. Habilitar IP Forwarding en Windows
Write-Host "`n3. Habilitando IP Forwarding..." -ForegroundColor Yellow
Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters -Name IPEnableRouter -Value 1

# 5. Configurar firewall para permitir conexiones desde cualquier IP
Write-Host "`n4. Configurando Firewall..." -ForegroundColor Yellow

# Eliminar reglas existentes
Remove-NetFirewallRule -DisplayName "Portfolio Frontend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Portfolio Backend" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Portfolio HTTPS" -ErrorAction SilentlyContinue

# Crear nuevas reglas más permisivas
New-NetFirewallRule -DisplayName "Portfolio Frontend" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow -RemoteAddress Any
New-NetFirewallRule -DisplayName "Portfolio Backend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow -RemoteAddress Any
New-NetFirewallRule -DisplayName "Portfolio HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow -RemoteAddress Any

Write-Host "   Firewall configurado" -ForegroundColor Green

# 6. Reiniciar servicios Docker
Write-Host "`n5. Reiniciando servicios Docker..." -ForegroundColor Yellow
wsl -d Debian -u jhasmany bash -c "cd /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker && docker compose restart"
Start-Sleep -Seconds 5

Write-Host "   Servicios Docker reiniciados" -ForegroundColor Green

# 7. Verificar conectividad
Write-Host "`n6. Verificando conectividad..." -ForegroundColor Yellow

Write-Host "   Probando localhost:80... " -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:80" -TimeoutSec 5 -UseBasicParsing
    Write-Host "OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "FAIL" -ForegroundColor Red
}

Write-Host "`n=== Configuración completa ===" -ForegroundColor Cyan
Write-Host "Prueba acceder a:" -ForegroundColor White
Write-Host "  http://localhost" -ForegroundColor Cyan
Write-Host "  http://192.168.0.19" -ForegroundColor Cyan
Write-Host "  http://181.114.111.21" -ForegroundColor Cyan

Write-Host "`nSi aún no funciona, reinicia Windows completamente." -ForegroundColor Yellow
