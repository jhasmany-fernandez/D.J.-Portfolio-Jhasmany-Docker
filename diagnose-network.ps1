# Script de diagnóstico de red para Portfolio
# Ejecutar como Administrador en PowerShell

Write-Host "=== Diagnóstico de Red - Portfolio ===" -ForegroundColor Cyan

# 1. Verificar IP de WSL2
Write-Host "`n1. IP de WSL2:" -ForegroundColor Yellow
$wsl_ip = wsl hostname -I
$wsl_ip = $wsl_ip.Trim().Split()[0]
Write-Host "   $wsl_ip" -ForegroundColor White

# 2. Verificar Port Forwarding
Write-Host "`n2. Port Forwarding configurado:" -ForegroundColor Yellow
netsh interface portproxy show all

# 3. Verificar Firewall
Write-Host "`n3. Reglas de Firewall:" -ForegroundColor Yellow
Get-NetFirewallRule -DisplayName "*Portfolio*" | Select-Object DisplayName, Enabled, Direction, Action

# 4. Verificar servicios Docker en WSL2
Write-Host "`n4. Servicios Docker:" -ForegroundColor Yellow
wsl docker compose -f /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker/docker-compose.yml ps

# 5. Probar conectividad desde Windows a WSL2
Write-Host "`n5. Prueba de conectividad Windows -> WSL2:" -ForegroundColor Yellow
Write-Host "   Puerto 8000 (Frontend):" -NoNewline
Test-NetConnection -ComputerName $wsl_ip -Port 8000 -InformationLevel Quiet
if ($?) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAIL" -ForegroundColor Red }

Write-Host "   Puerto 8001 (Backend):" -NoNewline
Test-NetConnection -ComputerName $wsl_ip -Port 8001 -InformationLevel Quiet
if ($?) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAIL" -ForegroundColor Red }

# 6. Verificar perfil de red
Write-Host "`n6. Perfil de red:" -ForegroundColor Yellow
Get-NetConnectionProfile | Select-Object Name, NetworkCategory, IPv4Connectivity

# 7. Verificar si Windows Firewall está bloqueando
Write-Host "`n7. Estado del Firewall:" -ForegroundColor Yellow
Get-NetFirewallProfile | Select-Object Name, Enabled

# 8. Probar curl local
Write-Host "`n8. Prueba con curl:" -ForegroundColor Yellow
Write-Host "   curl http://localhost:80 ..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:80" -TimeoutSec 5 -ErrorAction Stop
    Write-Host " OK (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 9. Verificar procesos escuchando en puertos
Write-Host "`n9. Procesos escuchando:" -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 80,443,8080 -State Listen -ErrorAction SilentlyContinue |
    Select-Object LocalAddress, LocalPort, State, OwningProcess |
    ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        [PSCustomObject]@{
            Port = $_.LocalPort
            State = $_.State
            Process = $process.ProcessName
        }
    } | Format-Table

Write-Host "`n=== Fin del diagnóstico ===" -ForegroundColor Cyan
