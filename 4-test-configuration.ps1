# Script para verificar la configuración completa
# Ejecutar en PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICACIÓN DE CONFIGURACIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener IPs
$windowsIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
$publicIP = "181.114.111.21"
$wslIP = (wsl hostname -I).Trim()

Write-Host "Configuración de Red:" -ForegroundColor Yellow
Write-Host "  IP Windows: $windowsIP" -ForegroundColor White
Write-Host "  IP WSL2:    $wslIP" -ForegroundColor White
Write-Host "  IP Pública: $publicIP" -ForegroundColor White
Write-Host ""

# Verificar servicios Docker en WSL
Write-Host "Verificando servicios Docker en WSL..." -ForegroundColor Yellow

$dockerStatus = wsl -d Ubuntu bash -c "cd /home/jhasmany/Repository-Docker/D.J.-Portfolio-Jhasmany-Docker && docker compose ps --format 'table {{.Service}}\t{{.Status}}'"

if ($dockerStatus) {
    Write-Host $dockerStatus
    Write-Host ""
} else {
    Write-Host "⚠ No se pudieron verificar servicios Docker" -ForegroundColor Yellow
    Write-Host ""
}

# Verificar Apache
Write-Host "Verificando Apache..." -ForegroundColor Yellow

$apacheService = Get-Service -Name "Apache*" -ErrorAction SilentlyContinue

if ($apacheService) {
    if ($apacheService.Status -eq "Running") {
        Write-Host "✓ Apache está corriendo" -ForegroundColor Green
    } else {
        Write-Host "✗ Apache NO está corriendo (Estado: $($apacheService.Status))" -ForegroundColor Red
        Write-Host "  Inicia Apache con: net start $($apacheService.Name)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ No se encontró servicio de Apache" -ForegroundColor Yellow
    Write-Host "  Apache puede estar instalado sin servicio de Windows" -ForegroundColor Gray
}

Write-Host ""

# Verificar puertos
Write-Host "Verificando puertos..." -ForegroundColor Yellow

$ports = @(
    @{Port=80; Service="Apache (Frontend)"},
    @{Port=8080; Service="Apache (Backend API)"},
    @{Port=3002; Service="Docker Backend"},
    @{Port=3003; Service="Docker Frontend"}
)

foreach ($portInfo in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $portInfo.Port -State Listen -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "  ✓ Puerto $($portInfo.Port) - $($portInfo.Service)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Puerto $($portInfo.Port) - $($portInfo.Service) (NO escuchando)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar firewall
Write-Host "Verificando reglas de firewall..." -ForegroundColor Yellow

$firewallRules = Get-NetFirewallRule -DisplayName "*Portfolio*", "*Apache*" -ErrorAction SilentlyContinue |
    Where-Object {$_.Enabled -eq "True"}

if ($firewallRules) {
    foreach ($rule in $firewallRules) {
        Write-Host "  ✓ $($rule.DisplayName)" -ForegroundColor Green
    }
} else {
    Write-Host "  ⚠ No se encontraron reglas de firewall habilitadas" -ForegroundColor Yellow
}

Write-Host ""

# Probar conexiones
Write-Host "Probando conectividad..." -ForegroundColor Yellow

$tests = @(
    @{URL="http://localhost"; Description="Frontend local (Apache)"},
    @{URL="http://localhost:8080"; Description="Backend API (Apache)"},
    @{URL="http://$wslIP:3003"; Description="Frontend Docker (WSL2)"},
    @{URL="http://$wslIP:3002"; Description="Backend Docker (WSL2)"}
)

foreach ($test in $tests) {
    try {
        $response = Invoke-WebRequest -Uri $test.URL -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ $($test.Description) - OK" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ $($test.Description) - HTTP $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ✗ $($test.Description) - ERROR" -ForegroundColor Red
        Write-Host "    $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Determinar estado general
$allGood = $true

if (-not $apacheService -or $apacheService.Status -ne "Running") {
    $allGood = $false
    Write-Host "⚠ Apache no está corriendo" -ForegroundColor Yellow
}

$port80Running = Get-NetTCPConnection -LocalPort 80 -State Listen -ErrorAction SilentlyContinue
$port8080Running = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue

if (-not $port80Running -or -not $port8080Running) {
    $allGood = $false
}

if ($allGood) {
    Write-Host "✓ TODO CONFIGURADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host ""
    Write-Host "Servicios disponibles:" -ForegroundColor White
    Write-Host "  • Localmente:" -ForegroundColor Cyan
    Write-Host "    - Frontend: http://localhost" -ForegroundColor White
    Write-Host "    - Backend:  http://localhost:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "  • Desde red local:" -ForegroundColor Cyan
    Write-Host "    - Frontend: http://$windowsIP" -ForegroundColor White
    Write-Host "    - Backend:  http://$windowsIP:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "  • Desde internet (después de configurar router):" -ForegroundColor Cyan
    Write-Host "    - Frontend: http://$publicIP" -ForegroundColor White
    Write-Host "    - Backend:  http://$publicIP:8080" -ForegroundColor White
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "PRÓXIMO PASO: Configurar Port Forwarding en Router" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "En tu router (generalmente http://192.168.0.1):" -ForegroundColor White
    Write-Host "  1. Ir a 'Port Forwarding' o 'Virtual Server'" -ForegroundColor White
    Write-Host "  2. Agregar regla: Puerto Externo 80 → $windowsIP:80" -ForegroundColor White
    Write-Host "  3. Agregar regla: Puerto Externo 8080 → $windowsIP:8080" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠ HAY PROBLEMAS EN LA CONFIGURACIÓN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Revisa los errores arriba y:" -ForegroundColor Yellow
    Write-Host "  1. Verifica que Apache esté corriendo" -ForegroundColor White
    Write-Host "  2. Verifica que Docker esté corriendo en WSL2" -ForegroundColor White
    Write-Host "  3. Revisa los logs de Apache" -ForegroundColor White
    Write-Host "  4. Ejecuta nuevamente este script después de corregir" -ForegroundColor White
    Write-Host ""
}
