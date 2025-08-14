# EMAR – UIS | Empatía y Juicio Moral

Aplicación web sin servidor desplegable en Netlify que reproduce el experimento de empatía y juicio moral.

## Requisitos

- Node.js 18+
- Cuenta de [Netlify](https://www.netlify.com/)
- Netlify DB habilitada (Postgres serverless)

## Variables de entorno

Configurar en Netlify (y `.env` para desarrollo local):

- `DATABASE_URL`: cadena de conexión a Netlify DB.
- `SITE_URL`: URL pública del sitio.
- `HMAC_SECRET`: secreto para firmar IDs.
- `ADMIN_TOKEN`: token para exportar datos.
- `ABLY_API_KEY` (opcional): clave para actualizaciones en tiempo real.

## Desarrollo local

```bash
npm install
npm run dev
```

## Construir

```bash
npm run build
```

## Estructura

- `src/` frontend React + Tailwind.
- `netlify/functions/` funciones serverless.
- `db/schema.sql` definición de la base de datos.

## Netlify DB

1. Crear una base de datos desde el panel de Netlify.
2. Obtener la variable `DATABASE_URL` y configurarla en el proyecto.
3. Al ejecutar las funciones se aplicará automáticamente `db/schema.sql` si las tablas no existen.

## Deploy

1. Conecta el repositorio a Netlify.
2. Define las variables de entorno.
3. Despliega. El comando de build es `npm run build`.

## Exportar datos

Visita `/admin`, ingresa el `ADMIN_TOKEN` y descarga el CSV generado desde `/api/export`.

## Licencia

Uso académico.
