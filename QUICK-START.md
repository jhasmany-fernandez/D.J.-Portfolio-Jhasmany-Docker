# 🚀 Guía de Inicio Rápido - Docker

## Comandos Esenciales para Nueva Máquina

### 1. Clonar el Repositorio
```bash
git clone <URL-DEL-REPO>
cd jhasmany-portfolio
```

### 2. Instalación Automática

**Windows:**
```cmd
install-windows.bat
```

**Linux:**
```bash
chmod +x install-linux.sh
./install-linux.sh
```

### 3. Comandos Docker Básicos

```bash
# Levantar servicios
docker compose up -d

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Parar servicios
docker compose down
```

### 4. URLs de Acceso

- Frontend: http://localhost:3000
- Backend: http://localhost:3001/health

### 5. Solución WSL2 (Windows)

```bash
# Obtener IP de WSL2
hostname -I

# Usar desde Windows: http://IP:3000
```

### 6. Reset Completo (si hay problemas)

```bash
docker compose down -v --rmi all
docker system prune -a
docker compose up --build -d
```

## Estructura de Archivos Importantes

```
├── docker-compose.yml          # Configuración principal
├── install-windows.bat         # Script Windows
├── install-linux.sh           # Script Linux
├── Portfolio-Jhasmany-Frontend/Dockerfile
├── Portfolio-Jhasmany-Backend/Dockerfile
└── README.md                   # Documentación completa
```

## Checklist de Verificación

- [ ] Docker instalado y funcionando
- [ ] Contenedores corriendo (`docker compose ps`)
- [ ] Frontend accesible (puerto 3000)
- [ ] Backend respondiendo (puerto 3001)
- [ ] Logs sin errores críticos

## Contacto Rápido

Si tienes problemas, verifica:
1. Docker está instalado
2. Puertos 3000/3001 libres
3. Permisos de usuario Docker
4. WSL2 IP si usas Windows