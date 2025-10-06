# Modo Desarrollo - Docker Hot Reload

## Modo Desarrollo (con Hot Reload)

Para trabajar en modo desarrollo donde los cambios se reflejan automáticamente:

```bash
# Levantar en modo desarrollo
docker compose -f docker-compose.dev.yml up -d

# Ver logs en tiempo real
docker compose -f docker-compose.dev.yml logs -f

# Detener
docker compose -f docker-compose.dev.yml down
```

### Acceso:
- **Frontend (directo)**: http://localhost:3002
- **Backend (interno)**: puerto 3001 (solo accesible internamente)
- **Nginx**: http://localhost:8000

### Características:
- ✅ Hot Reload activado en frontend y backend
- ✅ Los cambios en archivos se reflejan automáticamente
- ✅ No necesitas reconstruir contenedores
- ✅ Frontend usa Turbopack para compilación rápida
- ✅ Backend usa nodemon para reinicio automático

## Modo Producción

Para producción sin hot reload:

```bash
# Levantar en modo producción
docker compose up -d

# Reconstruir cuando hay cambios
docker compose build
docker compose up -d
```

### Acceso:
- **Nginx**: http://localhost:8000

## Notas

- En **modo desarrollo**: editas archivos localmente y los cambios aparecen automáticamente
- En **modo producción**: necesitas reconstruir la imagen para ver cambios
- Los volúmenes en desarrollo sincronizan tu código local con el contenedor
