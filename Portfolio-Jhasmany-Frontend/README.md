# Jhasmany Fernandez Portfolio - Frontend

Portfolio web personal desarrollado con Next.js 15 y React 19.

## 🚀 Tecnologías

- **Next.js 15.1.7** - Framework React con App Router
- **React 19.0.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4.0.6** - Framework CSS utility-first
- **Node.js 20** - Runtime de JavaScript
- **Zod 4.1.12** - Validación de esquemas
- **Ky 1.11.0** - Cliente HTTP

## 🐳 Docker

### Construcción
El frontend está dockerizado usando **Node.js 20 Alpine** para:
- Menor tamaño de imagen
- Mejor rendimiento
- Compatibilidad con Next.js 15

### Puertos
- **Desarrollo**: 3002 (mapeado desde 3000 interno)
- **Producción**: Configurado para nginx reverse proxy

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Construcción para producción
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1
NODE_ENV=production
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y configuración
├── hooks/              # Custom hooks
├── services/           # Servicios de API
└── schemas/            # Esquemas de validación Zod
```

## 📞 API de Contacto

Integración completa con backend para manejo de formularios:
- Validación con Zod
- Cliente HTTP con Ky
- Manejo de errores
- Tipos TypeScript

## 🎨 Características

- ✅ Responsive design
- ✅ Dark/Light theme
- ✅ SEO optimizado
- ✅ Performance optimizado
- ✅ Formulario de contacto funcional
- ✅ Animaciones suaves
- ✅ PWA ready
