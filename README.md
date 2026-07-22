# ConectaPueblos

Frontend de una red social local para descubrir pueblos, compartir publicaciones y participar en actividades. Está construido con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4, y consume una API REST FastAPI mediante JWT.

## Requisitos

- Node.js compatible con Next.js 16.
- npm y las dependencias fijadas en `package-lock.json`.
- Una API ConectaPueblos accesible. Para validar datos reales, el backend debe ejecutarse con su modo mock desactivado.

## Configuración

Crea `.env.local` sin versionar y define una de estas variables públicas:

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

`NEXT_PUBLIC_API_BASE_URL` es la única fuente de verdad para la URL de la API. No incluyas secretos JWT ni credenciales de PostgreSQL en el frontend: cualquier variable `NEXT_PUBLIC_*` forma parte del bundle público.

## Desarrollo y comprobaciones

```bash
npm install
npm run dev
npx tsc --noEmit
npm run lint
npm run build
```

El build usa el modo Webpack soportado por Next.js 16 para ser reproducible en entornos que bloquean el puerto auxiliar de Turbopack.

La aplicación queda disponible normalmente en `http://localhost:3000`. Las rutas principales son `/community`, `/villages`, `/activities`, `/profile`, `/settings`, `/saved`, `/notifications`, `/messages` y `/admin`.

## Smoke test del backend

El modo por defecto solo realiza comprobaciones de lectura:

```bash
npm run smoke:backend -- --base-url http://127.0.0.1:8000
```

El script también contiene un modo mutable para una base QA local descartable. Está bloqueado para hosts no loopback y no debe ejecutarse contra producción. Consulta el checkpoint antes de usarlo.

## Documentación de integración

- [Matriz full-stack](docs/MATRIZ_INTEGRACION_FULLSTACK.md)
- [Auditoría full-stack](docs/AUDITORIA_FULLSTACK.md)
- [Backend pendiente](docs/FUNCIONALIDADES_PENDIENTES_BACKEND.md)
- [Endpoints backend sin uso](docs/ENDPOINTS_BACKEND_SIN_USO.md)
- [Roadmap recomendado](docs/ROADMAP_RECOMENDADO.md)
- [Checkpoint post-auditoría](docs/CHECKPOINT_POST_AUDITORIA.md)

El backend vive en un repositorio independiente. Durante la auditoría asociada a estos documentos se trató estrictamente como solo lectura: no se modificaron su código, configuración, migraciones ni datos.
