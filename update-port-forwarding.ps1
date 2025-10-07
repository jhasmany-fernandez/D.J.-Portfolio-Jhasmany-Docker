# Script para actualizar Port Forwarding de Windows -> WSL2
# Ejecutar como Administrador

Write-Host "=== Actualizando Port Forwarding para Portfolio ===" -ForegroundColor Cyan

# Obtener IP de WSL2
$wsl_ip = wsl hostname -I
$wsl_ip = $wsl_ip.Trim().Split()[0]

Write-Host "IP de WSL2 detectada: $wsl_ip" -ForegroundColor Yellow

# Limpiar reglas anteriores
Write-Host "`nLimpiando reglas anteriores..." -ForegroundColor Yellow
netsh interface portproxy delete v4tov4 listenport=80 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=443 listenaddress=0.0.0.0
netsh interface portproxy delete v4tov4 listenport=8080 listenaddress=0.0.0.0

# Configurar nuevas reglas
Write-Host "`nConfigurando nuevas reglas de port forwarding..." -ForegroundColor Yellow

# Puerto 80 -> 8000 (Frontend HTTP)
netsh interface portproxy add v4tov4 listenport=80 listenaddress=0.0.0.0 connectport=8000 connectaddress=$wsl_ip
Write-Host "  80 (HTTP) -> WSL2:8000 (Nginx Frontend)" -ForegroundColor Green

# Puerto 443 -> 8443 (Frontend HTTPS)
netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=8443 connectaddress=$wsl_ip
Write-Host "  443 (HTTPS) -> WSL2:8443 (Nginx HTTPS)" -ForegroundColor Green

# Puerto 8080 -> 8001 (Backend API)
netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8001 connectaddress=$wsl_ip
Write-Host "  8080 (API) -> WSL2:8001 (Nginx API)" -ForegroundColor Green

# Mostrar configuración actual
Write-Host "`n=== Configuración actual ===" -ForegroundColor Cyan
netsh interface portproxy show all

# Verificar firewall
Write-Host "`n=== Verificando reglas de Firewall ===" -ForegroundColor Cyan
$rules = @("Portfolio Frontend", "Portfolio Backend", "Portfolio HTTPS")

foreach ($ruleName in $rules) {
    $rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($rule) {
        Write-Host "  $ruleName - OK" -ForegroundColor Green
    } else {
        Write-Host "  $ruleName - NO EXISTE (creando...)" -ForegroundColor Yellow

        # Crear reglas faltantes
        if ($ruleName -eq "Portfolio Frontend") {
            New-NetFirewallRule -DisplayName "Portfolio Frontend" -Direction Inbound -LocalPort 80 -Protocol TCP -Action Allow
        } elseif ($ruleName -eq "Portfolio Backend") {
            New-NetFirewallRule -DisplayName "Portfolio Backend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
        } elseif ($ruleName -eq "Portfolio HTTPS") {
            New-NetFirewallRule -DisplayName "Portfolio HTTPS" -Direction Inbound -LocalPort 443 -Protocol TCP -Action Allow
        }
        Write-Host "  $ruleName - CREADA" -ForegroundColor Green
    }
}

Write-Host "`n=== Port Forwarding actualizado correctamente ===" -ForegroundColor Green
Write-Host "`nAcceso público:" -ForegroundColor Cyan
Write-Host "  Frontend: http://181.114.111.21" -ForegroundColor White
Write-Host "  HTTPS:    https://181.114.111.21" -ForegroundColor White
Write-Host "  Backend:  http://181.114.111.21:8080" -ForegroundColor White
