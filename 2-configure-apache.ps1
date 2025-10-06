# Script para configurar Apache automáticamente
# Ejecutar en PowerShell como Administrador

param(
    [string]$ApachePath
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN AUTOMÁTICA DE APACHE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener ruta de Apache
if (-not $ApachePath) {
    $ApachePath = $env:APACHE_PATH
}

if (-not $ApachePath) {
    $ApachePath = Read-Host "Ingresa la ruta de instalación de Apache (ej: C:\Apache24)"
}

if (-not (Test-Path $ApachePath)) {
    Write-Host "✗ Error: La ruta '$ApachePath' no existe" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\1-detect-apache.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "Ruta de Apache: $ApachePath" -ForegroundColor Green
Write-Host ""

# Rutas importantes
$httpdConf = Join-Path $ApachePath "conf\httpd.conf"
$extraPath = Join-Path $ApachePath "conf\extra"
$portfolioConf = Join-Path $extraPath "apache-portfolio.conf"

# Verificar que httpd.conf existe
if (-not (Test-Path $httpdConf)) {
    Write-Host "✗ Error: No se encontró httpd.conf en $httpdConf" -ForegroundColor Red
    exit 1
}

# Crear backup de httpd.conf
Write-Host "Creando backup de httpd.conf..." -ForegroundColor Yellow
$backupPath = "$httpdConf.backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $httpdConf $backupPath
Write-Host "✓ Backup creado: $backupPath" -ForegroundColor Green
Write-Host ""

# Leer httpd.conf
$httpdContent = Get-Content $httpdConf -Raw

# Módulos necesarios
$requiredModules = @(
    "mod_proxy.so",
    "mod_proxy_http.so",
    "mod_headers.so"
)

Write-Host "Verificando y habilitando módulos necesarios..." -ForegroundColor Yellow
$modified = $false

foreach ($module in $requiredModules) {
    $moduleLine = "LoadModule " + $module.Replace(".so", "_module modules/$module")

    if ($httpdContent -match "#\s*$([regex]::Escape($moduleLine))") {
        Write-Host "  Habilitando: $module" -ForegroundColor Yellow
        $httpdContent = $httpdContent -replace "#\s*$([regex]::Escape($moduleLine))", $moduleLine
        $modified = $true
    } elseif ($httpdContent -match [regex]::Escape($moduleLine)) {
        Write-Host "  ✓ Ya habilitado: $module" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ No encontrado en httpd.conf: $module" -ForegroundColor Yellow
        Write-Host "    Se agregará manualmente" -ForegroundColor Gray
        # Agregar al final de la sección de módulos
        $httpdContent = $httpdContent -replace "(LoadModule.*\n)", "`$1$moduleLine`n"
        $modified = $true
    }
}

# Verificar Listen 8080
Write-Host ""
Write-Host "Configurando puerto 8080..." -ForegroundColor Yellow

if ($httpdContent -notmatch "Listen\s+8080") {
    Write-Host "  Agregando Listen 8080" -ForegroundColor Yellow
    # Agregar después de Listen 80
    $httpdContent = $httpdContent -replace "(Listen\s+80\s*\n)", "`$1Listen 8080`n"
    $modified = $true
} else {
    Write-Host "  ✓ Listen 8080 ya configurado" -ForegroundColor Green
}

# Verificar Include de portfolio.conf
Write-Host ""
Write-Host "Configurando Include para portfolio..." -ForegroundColor Yellow

$includeeLine = "Include conf/extra/apache-portfolio.conf"

if ($httpdContent -notmatch [regex]::Escape($includeLine)) {
    Write-Host "  Agregando Include de apache-portfolio.conf" -ForegroundColor Yellow
    $httpdContent += "`n# Portfolio Configuration`n$includeLine`n"
    $modified = $true
} else {
    Write-Host "  ✓ Include ya configurado" -ForegroundColor Green
}

# Guardar httpd.conf si fue modificado
if ($modified) {
    Write-Host ""
    Write-Host "Guardando cambios en httpd.conf..." -ForegroundColor Yellow
    Set-Content -Path $httpdConf -Value $httpdContent -Encoding UTF8
    Write-Host "✓ httpd.conf actualizado" -ForegroundColor Green
}

# Copiar apache-portfolio.conf a conf/extra
Write-Host ""
Write-Host "Instalando apache-portfolio.conf..." -ForegroundColor Yellow

$wslPath = "\\wsl.localhost\Ubuntu\home\jhasmany\Repository-Docker\D.J.-Portfolio-Jhasmany-Docker\apache-portfolio.conf"

if (Test-Path $wslPath) {
    Copy-Item $wslPath $portfolioConf -Force
    Write-Host "✓ apache-portfolio.conf copiado a $portfolioConf" -ForegroundColor Green
} else {
    Write-Host "⚠ No se encontró apache-portfolio.conf en WSL" -ForegroundColor Yellow
    Write-Host "  Ruta esperada: $wslPath" -ForegroundColor Gray
    Write-Host "  Copia manualmente el archivo a: $portfolioConf" -ForegroundColor Yellow
}

# Verificar sintaxis de Apache
Write-Host ""
Write-Host "Verificando configuración de Apache..." -ForegroundColor Yellow

$httpdExe = Join-Path $ApachePath "bin\httpd.exe"

if (Test-Path $httpdExe) {
    $testResult = & $httpdExe -t 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Configuración de Apache válida" -ForegroundColor Green
    } else {
        Write-Host "✗ Error en la configuración:" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
        Write-Host ""
        Write-Host "Restaurando backup..." -ForegroundColor Yellow
        Copy-Item $backupPath $httpdConf -Force
        Write-Host "✓ Backup restaurado" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "  Ejecuta: .\3-configure-firewall.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Después reinicia Apache:" -ForegroundColor Yellow
Write-Host "  Opción 1: Restart-Service Apache2.4" -ForegroundColor White
Write-Host "  Opción 2: net stop Apache2.4 && net start Apache2.4" -ForegroundColor White
