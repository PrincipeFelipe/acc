# ACC Construcción - Web Corporativa "Arch Pro"

Este proyecto es una web corporativa moderna para una empresa de construcción, diseñada con un estilo arquitectónico minimalista y funciones avanzadas de administración.

## 🚀 Tecnologías

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animaciones**: AOS (Animate On Scroll), CSS Transitions
- **Iconos**: Material Symbols Outlined (Google Fonts)

## 🛠️ Instalación y Setup

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repo>
   cd acc-web
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Variables de Entorno**:
   Crear un archivo `.env` en la raíz con las credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```
   *Nota: El proyecto ya incluye una configuración por defecto en `src/lib/supabase.js`, pero se recomienda usar variables de entorno para producción.*

4. **Base de Datos (Supabase)**:
   Si es una instalación nueva, ejecuta el script SQL en la consola SQL de Supabase:
   - Archivo: `schema.sql` (en la raíz del proyecto).

5. **Bucket de Almacenamiento**:
   Crear un bucket público en Supabase Storage llamado `imagenes`.

6. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 🏗️ Estructura del Proyecto

- `src/components`: Componentes reutilizables (HeroSlider, ProjectCard, Header, etc.)
- `src/pages`: Páginas públicas y del panel de administración.
- `src/context`: Contextos de React (AuthContext).
- `src/lib`: Configuración de servicios externos (suapbase.js).

## 🎨 Estilo "Arch Pro"

El diseño sigue una línea minimalista con:
- **Tipografía**: Manrope (Títulos) y Noto Sans (Textos).
- **Colores**: Dark (`#111418`), Surface (`#1a2632`) y Primary (`#137fec`).
- **Efectos**: Ken Burns en sliders, transiciones suaves, y tarjetas con overlay.

## 🔐 Panel de Administración

Acceso protegido en `/acc-login` (o botón "Panel Admin" en el footer/header si está logueado).
- **Dashboard**: Estadísticas generales.
- **Trabajos**: CRUD completo para portafolio.
- **Promociones**: Gestión de ofertas inmobiliarias.
- **Mensajes**: Bandeja de entrada de contacto.
