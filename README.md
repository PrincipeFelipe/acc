# ACC Construcción - Web Corporativa

Web corporativa moderna para la empresa de construcción ACC, con panel de administración completo y base de datos en Supabase.

## 🚀 Características

### Web Pública
- **Inicio**: Hero, servicios, proyectos destacados y CTA
- **Trabajos/Obras**: Galería filtrable por categorías
- **Promociones**: Promociones inmobiliarias con detalles
- **Contacto**: Formulario funcional que guarda en base de datos
- **Diseño responsive** y animaciones modernas (AOS)

### Panel de Administración
- **Dashboard** con estadísticas
- **CRUD de Trabajos**: Crear, leer, actualizar, eliminar proyectos
- **CRUD de Promociones**: Gestión de promociones inmobiliarias
- **Mensajes**: Ver y gestionar mensajes de contacto

## 📁 Estructura de Archivos

```
ACC/
├── index.html          # Página principal
├── js/
│   ├── app.js         # Componentes públicos + configuración
│   └── admin.js       # Panel de administración
├── css/               # Estilos adicionales (opcional)
├── logo.png           # Logo de la empresa
└── README.md          # Este archivo
```

## 🔧 Configuración

### Base de Datos (Supabase)

El proyecto está conectado a:
- **URL**: `https://xtmzmfekecudnjrkqnol.supabase.co`
- **Proyecto**: ACC

### Tablas creadas:
- `categorias`: Categorías de proyectos
- `trabajos`: Proyectos/obras
- `trabajo_imagenes`: Imágenes de cada trabajo
- `promociones`: Promociones inmobiliarias
- `mensajes_contacto`: Mensajes del formulario

## 🔐 Acceso al Panel de Administración

### Enlace Secreto
El acceso al login **NO está visible** en la navegación pública. Para acceder:

```
file:///e:/Proyectos/ACC/index.html#/acc-login
```

O si está desplegado en un servidor:
```
https://tu-dominio.com/#/acc-login
```

### Credenciales de Administrador

```
Email: admin@acc-construccion.com
Contraseña: ACC_Admin_2024!
```

> ⚠️ **IMPORTANTE**: Cambia estas credenciales desde el [Dashboard de Supabase](https://supabase.com/dashboard) después del primer acceso.

## 🖥️ Uso Local

1. Simplemente abre `index.html` en un navegador moderno
2. O usa un servidor local:
   ```bash
   npx serve .
   ```

## 📱 Responsive

La web está optimizada para:
- 📱 Móvil (< 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (> 1024px)

## 🎨 Tecnologías

- **React 18** (CDN)
- **TailwindCSS** (CDN)
- **Supabase** (Backend-as-a-Service)
- **AOS** (Animate on Scroll)
- **Google Fonts** (Manrope, Noto Sans)
- **Material Symbols** (Iconos)

## 📝 Notas de Seguridad

1. El enlace de login (`/acc-login`) es secreto y no debe compartirse públicamente
2. Las credenciales iniciales deben cambiarse después del primer uso
3. RLS (Row Level Security) está habilitado en todas las tablas
4. Los visitantes solo pueden leer datos públicos y enviar mensajes de contacto

## 🌐 Despliegue

Para desplegar en producción:

1. **GitHub Pages** o **Netlify** (estático)
2. Sube todos los archivos a un servidor web
3. Asegúrate de que las URLs de Supabase sean accesibles

---

© 2024 ACC Construcción S.L. - Desarrollado con ❤️
