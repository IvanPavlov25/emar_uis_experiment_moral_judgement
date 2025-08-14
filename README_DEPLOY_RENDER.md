# Deploy en Render (oTree 5)

## Variables de entorno (Settings → Environment)
- OTREE_PRODUCTION=1
- OTREE_AUTH_LEVEL=STUDY
- OTREE_ADMIN_PASSWORD=<pon-una-clave-fuerte>

*(Opcional, para sesiones grandes)*
- DATABASE_URL=<si agregas Postgres en Render>
- OTREE_REDIS_URL=<si agregas Redis en Render>

## Comandos de Render
- Build Command:
  pip install -r requirements.txt && otree collectstatic --noinput

- Start Command:
  otree prodserver $PORT

## Notas
- `_static/` debe existir o ejecutarse `otree collectstatic` en build.
- Si usas Postgres/Redis de Render, crea los recursos y pega sus URLs en las variables de entorno.
