# ConectaPueblos — Guía de implementación backend

## Resumen del proyecto

ConectaPueblos es una red social comunitaria para conectar pueblos, personas, actividades locales, publicaciones comunitarias y participación vecinal. El frontend de la Fase 1 está completo, desplegado en Vercel y actualmente funciona con datos mock locales.

La experiencia del frontend incluye:

- Descubrimiento de pueblos.
- Descubrimiento y páginas de detalle de actividades.
- Feed de publicaciones comunitarias.
- Perfil de usuario y dashboard.
- Interacciones sociales mock como likes, elementos guardados, seguimiento de pueblos e inscripción a actividades.
- Rutas placeholder futuras para explorar, notificaciones, mensajes y ajustes.

URL pública del frontend:

https://conecta-pueblos.vercel.app

## Objetivo del backend

El backend debe proporcionar la capa real de datos y persistencia necesaria para reemplazar los mocks actuales del frontend. Debe soportar:

- Registro e inicio de sesión de usuarios.
- Gestión del perfil de usuario.
- Listado y detalle de pueblos.
- Listado y detalle de actividades.
- Participación en actividades.
- Publicaciones comunitarias.
- Likes.
- Publicaciones y actividades guardadas.
- Seguimiento de pueblos.
- Mensajes futuros.
- Notificaciones futuras.
- Soporte básico para panel de administración.

## Stack backend recomendado

- FastAPI
- Python
- PostgreSQL Neon
- SQLAlchemy
- Alembic
- Pydantic
- JWT
- Passlib/Bcrypt
- `python-dotenv`
- CORS configurado para Vercel y desarrollo local del frontend

## Estructura backend sugerida

```txt
backend/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── cors.py
│   ├── db/
│   │   ├── database.py
│   │   └── session.py
│   ├── models/
│   ├── schemas/
│   ├── api/
│   │   └── v1/
│   │       ├── router.py
│   │       └── endpoints/
│   ├── services/
│   └── seed/
├── alembic/
├── requirements.txt
├── .env.example
└── README.md
```

Módulos de endpoints recomendados:

- `auth.py`
- `users.py`
- `villages.py`
- `activities.py`
- `posts.py`
- `search.py`
- `explore.py`
- `notifications.py`
- `messages.py`
- `admin.py`

## Fases del backend

### Fase 2.0 — Base del backend

- Crear la carpeta `backend/`.
- Crear la aplicación FastAPI.
- Configurar CORS.
- Crear `GET /health`.
- Crear la estructura del proyecto.
- Crear `.env.example`.
- Añadir logging básico y manejo de errores.

### Fase 2.1 — Base de datos

- Conectar PostgreSQL Neon.
- Configurar SQLAlchemy.
- Configurar Alembic.
- Crear los modelos iniciales.
- Crear las migraciones iniciales.
- Añadir datos seed basados en los mocks actuales del frontend.

### Fase 2.2 — Autenticación

- Registro.
- Login.
- Emisión y validación de JWT.
- Hashing de contraseñas.
- `GET /api/v1/auth/me`.
- Proteger endpoints específicos de usuario y endpoints de escritura.

### Fase 2.3 — Recursos principales

- Usuarios.
- Pueblos.
- Actividades.
- Publicaciones comunitarias.

### Fase 2.4 — Interacciones sociales

- Likes.
- Publicaciones guardadas.
- Actividades guardadas.
- Seguimiento de pueblos.
- Participantes de actividades.

### Fase 2.5 — Integración con frontend

- Reemplazar gradualmente las lecturas mock desde `lib/api/*`.
- Configurar `NEXT_PUBLIC_API_URL`.
- Conectar primero los endpoints GET.
- Conectar auth después de estabilizar las pantallas de solo lectura.
- Conectar interacciones POST/DELETE después de auth.
- Conectar formularios de creación/edición al final.

### Fase 2.6 — Admin

- Roles.
- Crear/editar pueblos.
- Crear/editar actividades.
- Moderar publicaciones.
- Métricas básicas para el dashboard de administración.

## Variables de entorno

El `.env.example` del backend debe incluir:

```env
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:3000
VERCEL_FRONTEND_URL=https://conecta-pueblos.vercel.app
```

El `.env.example` del frontend ya incluye:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## CORS

El backend debe permitir los orígenes actuales del frontend:

- `http://localhost:3000`
- `http://localhost:3001`
- `https://conecta-pueblos.vercel.app`

Comportamiento CORS sugerido en FastAPI:

- Permitir credenciales.
- Permitir métodos HTTP estándar: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.
- Permitir headers `Authorization` y `Content-Type`.

## Comandos de desarrollo

Configuración local sugerida para el backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Comandos Alembic sugeridos:

```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
alembic downgrade -1
```

Comprobación de salud sugerida:

```bash
curl http://localhost:8000/health
```

## Notas de integración con frontend

El frontend ya tiene una capa preparada para API:

- `lib/api/client.ts`
- `lib/api/villages.service.ts`
- `lib/api/activities.service.ts`
- `lib/api/community.service.ts`
- `lib/api/auth.service.ts`

Las funciones actuales de servicios devuelven datos mock locales. La ruta de integración recomendada es conservar el nombre de cada función de servicio y reemplazar su implementación interna por `apiFetch`.

Patrón futuro de ejemplo:

```ts
export function getVillages() {
  return apiFetch<VillageDto[]>("/api/v1/villages");
}
```

## Hallazgos clave de la auditoría frontend

- Los IDs actuales del frontend son strings tipo slug, como `rupit` y `ruta-salt-sallent`.
- El backend debería usar UUID como claves primarias y slugs únicos para URLs públicas.
- Las actividades actuales guardan `date` y `time` por separado; el backend debería exponer `starts_at` y, si hace falta, mapearlo a campos de presentación del frontend.
- Las publicaciones actuales incluyen tanto `comments` como `commentsCount`; el backend debería estandarizar en `comments_count`.
- El usuario actual es un único usuario mock obtenido desde `getCurrentUserMock`.
- Las interacciones sociales actuales se guardan en `localStorage` y deben convertirse en registros autenticados del backend.
- El formulario actual de creación de actividad no envía datos; eventualmente debe llamar a `POST /api/v1/activities`.
