# Script para configurar Firewall de Windows
# Ejecutar en PowerShell como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN DE FIREWALL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar permisos de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "✗ Este script requiere permisos de Administrador" -ForegroundColor Red
    Write-Host "  Ejecuta PowerShell como Administrador" -ForegroundColor Yellow
    exit 1
}

Write-Host "Configurando reglas de firewall para Portfolio..." -ForegroundColor Yellow
Write-Host ""

# Eliminar reglas existentes (si existen)
Write-Host "Limpiando reglas anteriores..." -ForegroundColor Yellow

$existingRules = @(
    "HTTP Portfolio",
    "HTTP Apache API",
    "HTTPS Portfolio"
)

foreach ($ruleName in $existingRules) {
    $rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    if ($rule) {
        Remove-NetFirewallRule -DisplayName $ruleName
        Write-Host "  ✓ Eliminada regla antigua: $ruleName" -ForegroundColor Gray
    }
}

Write-Host ""

# Crear nuevas reglas
Write-Host "Creando nuevas reglas de firewall..." -ForegroundColor Yellow

# Puerto 80 (HTTP)
try {
    New-NetFirewallRule `
        -DisplayName "HTTP Portfolio" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 80 `
        -Action Allow `
        -Profile Any `
        -Description "Permite tráfico HTTP para Portfolio en puerto 80" | Out-Null
    Write-Host "✓ Puerto 80 (HTTP) habilitado" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al configurar puerto 80: $_" -ForegroundColor Red
}

# Puerto 8080 (Apache API)
try {
    New-NetFirewallRule `
        -DisplayName "HTTP Apache API" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8080 `
        -Action Allow `
        -Profile Any `
        -Description "Permite tráfico HTTP para Backend API en puerto 8080" | Out-Null
    Write-Host "✓ Puerto 8080 (API) habilitado" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al configurar puerto 8080: $_" -ForegroundColor Red
}

# Puerto 443 (HTTPS) - para futuro uso
try {
    New-NetFirewallRule `
        -DisplayName "HTTPS Portfolio" `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 443 `
        -Action Allow `
        -Profile Any `
        -Description "Permite tráfico HTTPS para Portfolio en puerto 443 (futuro)" | Out-Null
    Write-Host "✓ Puerto 443 (HTTPS) habilitado (para futuro uso)" -ForegroundColor Green
} catch {
    Write-Host "✗ Error al configurar puerto 443: $_" -ForegroundColor Red
}

# Verificar reglas creadas
Write-Host ""
Write-Host "Verificando reglas creadas..." -ForegroundColor Yellow

$rules = Get-NetFirewallRule -DisplayName "*Portfolio*", "*Apache API*" |
    Select-Object DisplayName, Enabled, Direction, Action

if ($rules) {
    Write-Host ""
    $rules | Format-Table -AutoSize
} else {
    Write-Host "⚠ No se encontraron reglas creadas" -ForegroundColor Yellow
}

# Verificar estado de puertos
Write-Host ""
Write-Host "Estado actual de puertos:" -ForegroundColor Yellow

$port80 = Get-NetTCPConnection -LocalPort 80 -State Listen -ErrorAction SilentlyContinue
$port8080 = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue

if ($port80) {
    Write-Host "✓ Puerto 80 está en LISTEN" -ForegroundColor Green
} else {
    Write-Host "⚠ Puerto 80 NO está en escucha (Apache debe estar corriendo)" -ForegroundColor Yellow
}

if ($port8080) {
    Write-Host "✓ Puerto 8080 está en LISTEN" -ForegroundColor Green
} else {
    Write-Host "⚠ Puerto 8080 NO está en escucha (Apache debe estar corriendo)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FIREWALL CONFIGURADO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Puertos habilitados en firewall:" -ForegroundColor White
Write-Host "  ✓ 80   (HTTP - Frontend)" -ForegroundColor Green
Write-Host "  ✓ 8080 (HTTP - Backend API)" -ForegroundColor Green
Write-Host "  ✓ 443  (HTTPS - Para futuro uso)" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "  1. Reinicia Apache" -ForegroundColor Cyan
Write-Host "  2. Verifica acceso local: http://192.168.0.19" -ForegroundColor Cyan
Write-Host "  3. Configura Port Forwarding en tu router" -ForegroundColor Cyan
Write-Host "  4. Ejecuta: .\4-test-configuration.ps1" -ForegroundColor Cyan
