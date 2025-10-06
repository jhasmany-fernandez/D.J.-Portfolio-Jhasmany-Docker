# Script para detectar y verificar instalación de Apache
# Ejecutar en PowerShell como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DETECTANDO INSTALACIÓN DE APACHE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Posibles rutas de Apache
$apachePaths = @(
    "C:\Apache24",
    "C:\Apache",
    "C:\Program Files\Apache Group\Apache2",
    "C:\xampp\apache",
    "C:\wamp\bin\apache\apache*",
    "C:\wamp64\bin\apache\apache*"
)

$foundPath = $null

Write-Host "Buscando Apache en rutas comunes..." -ForegroundColor Yellow

foreach ($path in $apachePaths) {
    if (Test-Path $path) {
        $httpd = Get-ChildItem -Path $path -Filter "httpd.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($httpd) {
            $foundPath = Split-Path $httpd.FullName
            Write-Host "✓ Apache encontrado en: $foundPath" -ForegroundColor Green
            break
        }
    }
}

if (-not $foundPath) {
    Write-Host "✗ No se encontró Apache instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Instalar Apache desde: https://www.apachelounge.com/download/"
    Write-Host "2. Instalar XAMPP desde: https://www.apachelounge.com/"
    Write-Host "3. Si ya tienes Apache instalado, proporciona la ruta manualmente"
    Write-Host ""
    $manualPath = Read-Host "Ingresa la ruta de Apache (o presiona Enter para salir)"

    if ($manualPath -and (Test-Path $manualPath)) {
        $foundPath = $manualPath
    } else {
        Write-Host "Saliendo..." -ForegroundColor Red
        exit 1
    }
}

# Verificar archivos importantes
Write-Host ""
Write-Host "Verificando archivos de configuración..." -ForegroundColor Yellow

$confPath = Join-Path $foundPath "conf\httpd.conf"
$extraPath = Join-Path $foundPath "conf\extra"

if (Test-Path $confPath) {
    Write-Host "✓ httpd.conf encontrado: $confPath" -ForegroundColor Green
} else {
    Write-Host "✗ httpd.conf NO encontrado" -ForegroundColor Red
}

if (Test-Path $extraPath) {
    Write-Host "✓ Carpeta extra/ encontrada: $extraPath" -ForegroundColor Green
} else {
    Write-Host "✗ Carpeta extra/ NO encontrada" -ForegroundColor Red
}

# Verificar servicio
Write-Host ""
Write-Host "Verificando servicio de Apache..." -ForegroundColor Yellow

$service = Get-Service -Name "Apache*" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "✓ Servicio encontrado: $($service.Name)" -ForegroundColor Green
    Write-Host "  Estado: $($service.Status)" -ForegroundColor $(if ($service.Status -eq "Running") { "Green" } else { "Yellow" })
} else {
    Write-Host "⚠ No se encontró servicio de Apache registrado" -ForegroundColor Yellow
    Write-Host "  Apache puede estar instalado pero no registrado como servicio" -ForegroundColor Gray
}

# Verificar si Apache está escuchando en puerto 80 o 8080
Write-Host ""
Write-Host "Verificando puertos..." -ForegroundColor Yellow

$port80 = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
$port8080 = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($port80) {
    Write-Host "✓ Puerto 80 está en uso (probablemente Apache)" -ForegroundColor Green
} else {
    Write-Host "⚠ Puerto 80 no está en uso" -ForegroundColor Yellow
}

if ($port8080) {
    Write-Host "✓ Puerto 8080 está en uso" -ForegroundColor Green
} else {
    Write-Host "⚠ Puerto 8080 no está en uso" -ForegroundColor Yellow
}

# Guardar ruta para siguiente script
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ruta de Apache: $foundPath" -ForegroundColor White
Write-Host ""
Write-Host "Guarda esta ruta para los siguientes pasos" -ForegroundColor Yellow

# Guardar en variable de entorno temporal
[Environment]::SetEnvironmentVariable("APACHE_PATH", $foundPath, "Process")
Write-Host ""
Write-Host "Variable APACHE_PATH configurada para esta sesión" -ForegroundColor Green
Write-Host "Puedes continuar con el siguiente script: 2-configure-apache.ps1" -ForegroundColor Cyan
