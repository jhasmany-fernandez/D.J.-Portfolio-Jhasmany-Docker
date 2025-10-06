# Script para configurar Port Forwarding de WSL2 a Windows
# Ejecutar como Administrador en PowerShell

# IP de WSL2 (se obtiene dinámicamente)
$wslIP = (wsl hostname -I).Trim()
Write-Host "IP de WSL2 detectada: $wslIP"

# IP de Windows (interfaz principal)
$windowsIP = "192.168.0.19"

# Puertos a redirigir
$ports = @(3002, 3003)

# Eliminar reglas existentes (si existen)
Write-Host "`nEliminando reglas anteriores..."
foreach ($port in $ports) {
    netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 2>$null
    netsh advfirewall firewall delete rule name="WSL2 Port $port" 2>$null
}

# Agregar reglas de port forwarding
Write-Host "`nConfigurando port forwarding..."
foreach ($port in $ports) {
    Write-Host "Configurando puerto $port..."

    # Port forwarding
    netsh interface portproxy add v4tov4 `
        listenport=$port `
        listenaddress=0.0.0.0 `
        connectport=$port `
        connectaddress=$wslIP

    # Regla de firewall
    netsh advfirewall firewall add rule `
        name="WSL2 Port $port" `
        dir=in `
        action=allow `
        protocol=TCP `
        localport=$port
}

# Mostrar configuración actual
Write-Host "`nPort Forwarding configurado:"
netsh interface portproxy show v4tov4

Write-Host "`n==================================="
Write-Host "Servicios expuestos en Windows:"
Write-Host "Frontend: http://$windowsIP:3003"
Write-Host "Backend:  http://$windowsIP:3002"
Write-Host "==================================="
Write-Host "`nNOTA: Ahora necesitas configurar port forwarding en tu router"
Write-Host "para redirigir del puerto 80 (IP pública) al puerto 3003 (Windows)"
