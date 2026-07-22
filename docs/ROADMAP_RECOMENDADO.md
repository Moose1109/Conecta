# Roadmap recomendado de ConectaPueblos

## Objetivo

Este roadmap transforma los hallazgos de la auditoría del **2026-07-20** en una secuencia de producto e ingeniería. No autoriza cambios automáticos en backend, base de datos o despliegue. Cada iniciativa backend debe implementarse en su repositorio, con migración y QA propios, y solo después conectarse desde frontend.

Las referencias `BACK-xxx` corresponden a [`FUNCIONALIDADES_PENDIENTES_BACKEND.md`](./FUNCIONALIDADES_PENDIENTES_BACKEND.md). Los endpoints que ya existen pero aún no tienen UI están en [`ENDPOINTS_BACKEND_SIN_USO.md`](./ENDPOINTS_BACKEND_SIN_USO.md).

## Principios de priorización

1. Seguridad e integridad antes que nuevas funciones.
2. Un único entorno QA homogéneo: datos reales y `USE_MOCK_DATA=false`; nunca GET mock con mutaciones contra DB.
3. Ninguna acción se considera terminada hasta sobrevivir recarga y otra sesión/dispositivo cuando corresponda.
4. Backend es autoridad de permisos, ownership, contadores y relaciones; frontend puede optimizar, no inventar persistencia.
5. Contrato OpenAPI, migración, test y observabilidad forman parte de cada endpoint, no son tareas posteriores opcionales.
6. Accesibilidad, móvil, errores y estados vacíos se incluyen en el criterio de aceptación de cada historia.

## Siguiente paso inmediato — estabilización y evidencia reproducible

Horizonte sugerido: **antes de aceptar nuevas funciones**.

| Área | Trabajo recomendado | Prioridad / motivo | Dependencias | Criterio de salida |
|---|---|---|---|---|
| Seguridad | Rotar cualquier secreto que haya estado versionado; retirar `.env` del repositorio; prohibir arranque no-local con secreto default; proteger seeds y eliminar credenciales previsibles. | P0; BACK-024. Un secreto/token comprometido invalida el resto del QA. | Gestión de secretos por entorno y responsable de seguridad. | Escáner de secretos limpio, secretos rotados, seed bloqueado fuera de local/QA y prueba de arranque fallido con config insegura. |
| Despliegue | Crear entorno QA separado de producción, DB descartable o reseteable, CORS explícito y `USE_MOCK_DATA=false`. | P0/P1; evita la mezcla mock/DB observada. | Infraestructura, URL QA y credenciales no compartidas. | Health/readiness 200; listados y mutaciones leen/escriben la misma DB; producción nunca recibe datos `qa_audit_*`. |
| Autenticación | Rechazar bearer presente pero inválido; validar `sub` como UUID y bloquear usuarios borrados/suspendidos. | P1; BACK-022/024. | Cambios backend y tests de permisos. | 401 estable para token inválido/caducado; endpoint público solo degrada a anónimo si no se envía Authorization. |
| Contrato API | Declarar HTTP Bearer en OpenAPI y response models de follow/join/save/like; documentar 401/403/404/409/422. | P1; BACK-022. | Decisión de convención canónica. | OpenAPI genera cliente sin tipos `{}` y Swagger permite auth Bearer por operación. |
| Base de datos | Corregir null en PATCH, rollback de `IntegrityError`, atomicidad de like/aforo, enums/checks y relación temporal. | P1; BACK-025. | Migraciones revisadas y backup/rollback. | Tests concurrentes no crean sobreaforo/drift; null inválido devuelve 422/409, nunca 500. |
| Fechas | Adoptar UTC con offset y definir semántica de actividades pasadas/canceladas/draft. | P1/P2; elimina ambigüedad cross-timezone. | Migración de columnas/datos y contrato versionado. | API emite ISO 8601 aware; navegador en distintas zonas muestra el instante esperado. |
| Testing | Crear una suite backend mínima real: health, auth, permisos, CRUD, interacciones, integridad y OpenAPI. | P1; hoy `test_health.py` está vacío y pytest no está declarado. | Dependencias de test solo en backend; DB QA transaccional. | CI ejecuta tests sin tocar producción; fixtures únicas y limpieza verificable. |
| QA frontend | Mantener TypeScript/lint/build aprobados; ejecutar smoke de solo lectura y navegador; después smoke mutable solo con autorización y DB QA. | P1; cambia estados “sin validar” a evidencia. | Backend QA homogéneo y usuario QA descartable. | Resultados registrados en checkpoint; no quedan pruebas runtime ambiguas antes de release. |
| Rendimiento / fuentes | Autoalojar Manrope y Fraunces con licencias verificadas y `next/font/local`; evaluar volver al build Turbopack fuera del sandbox. | P2; elimina dependencia runtime de Google Fonts y simplifica CSP/build. | Archivos WOFF2 oficiales y presupuesto de assets. | Build sin red, tipografía idéntica, `font-display: swap`, sin layout shift apreciable y Turbopack validado en CI normal. |
| Observabilidad | Introducir `request_id`, logs estructurados sin secretos y correlación frontend/backend. | P1/P2; permite diagnosticar 500/red sin enseñar detalles al usuario. | Middleware backend y plataforma de logs. | Cada error API tiene code/request_id; logs excluyen JWT, passwords y URL DB. |
| Accesibilidad | Ejecutar teclado, focus y auditoría automatizada en las rutas críticas ya corregidas estáticamente. | P2; evita publicar regresiones invisibles en build. | Navegador/axe y matriz de rutas. | Sin violaciones críticas; foco de modal/drawer retorna al disparador; errores están asociados a campos. |

### Orden operativo inmediato

1. Congelar nuevas funciones sociales.
2. Asegurar secretos, seeds y entorno QA.
3. Corregir contrato/auth/integridad backend con migraciones separadas.
4. Activar tests backend y CI.
5. Ejecutar el smoke reproducible y las puertas frontend.
6. Solo entonces actualizar la matriz de `CONECTADO SIN VALIDAR` a `CONECTADO Y VALIDADO`.

## Siguiente sprint — completar el núcleo social y de cuenta

Horizonte sugerido: **un sprint tras estabilización**.

| Área | Entregable | Referencia | Dependencias | Criterio de aceptación |
|---|---|---|---|---|
| Autenticación | Recuperación de contraseña anti-enumeración, token de un uso y rate limit. | BACK-012 | Proveedor de email, templates, auditoría y política de expiración. | Solicitud siempre responde 202; token expira/no se reutiliza; password anterior deja de funcionar. |
| Sesión/seguridad | Diseñar refresh rotatorio y logout con revocación; refresh en cookie HttpOnly/Secure/SameSite. | BACK-013 | CORS/CSRF, tabla de sesiones y política multi-dispositivo. | Reuse detection, logout revoca refresh y ninguna credencial persistente queda en `localStorage`. |
| Perfil | Persistir `favorite_village_id` en el endpoint existente. | BACK-001 | FK, migración Alembic, `ON DELETE SET NULL`. | PUT y GET posterior devuelven UUID/null real; la UI puede retirar el estado pendiente. |
| Colecciones | Endpoints paginados para pueblos seguidos, actividades inscritas/organizadas y posts/actividades guardados. | BACK-002 a BACK-005 | Convención de paginación BACK-023. | Relaciones sobreviven login nuevo; totales exactos; no se descargan catálogos para filtrar. |
| Perfil | Stats públicas/privadas con definiciones explícitas. | BACK-006 | Colecciones personales y política de privacidad. | Counts coinciden con queries de control y no incluyen soft-deleted. |
| Social | CRUD de comentarios con ownership, soft delete, rate limit y contador transaccional. | BACK-007 | Notificación puede posponerse; moderación básica requerida. | CRUD/403/404/429 probados; contador estable bajo concurrencia y tras recarga. |
| Media | Upload de imágenes con validación MIME/tamaño, stripping de metadatos, storage y cleanup. | BACK-011 | Storage/CDN, secretos, lifecycle y ownership. | Asset válido persiste; inválido devuelve 413/415/422; nadie elimina media ajena. |
| Rendimiento | Migrar listados a envelope paginado y usar filtros servidor (`author_id`, `village_id`, fechas, status). | BACK-023 | Contrato versionado o transición backward-compatible. | Navegación estable >100 registros; `total`/`has_more` correctos; sin filtros masivos en cliente. |
| Frontend social | Conectar colecciones nuevas; retirar estados pendientes solo tras OpenAPI + QA; conservar optimismo con reconciliación. | BACK-001 a BACK-007 | Endpoints desplegados en QA. | Estado idéntico tras recarga/otro dispositivo; errores 401/403/409/422 visibles. |
| Gestión de contenido | Conectar update/delete de posts y actividades ya existentes con ownership, diálogo accesible y soporte 204. | Endpoints sin uso B.2/B.3 | Pruebas autor/tercero/admin y decisión de notificación al cancelar. | 403 no limpia sesión; delete retira el item tras 204; cancelación no deja UI huérfana. |
| Calidad | Añadir tests unitarios de adapters/session/error mapping y Playwright de auth/feed/actividad/perfil. | AUD-044 | Fixtures QA estables y selectors accesibles. | Suite en CI, sin dependencias de producción ni datos compartidos. |
| Móvil/a11y | Validar 375/430/768/1024/1280/1440, zoom 200 %, teclado y lector de pantalla en errores/modal/drawer. | AUD-045/046 | Entorno visual reproducible. | Sin overflow horizontal; target táctil >=44 px; navegación y mensajes accesibles. |

## Medio plazo — operación social, descubrimiento y administración

Horizonte sugerido: **2–4 sprints**, después de que el núcleo tenga telemetría y tests.

| Área | Entregable | Referencia | Riesgo / decisión necesaria | Criterio de aceptación |
|---|---|---|---|---|
| Notificaciones | Inbox, unread count, read/read-all y generación de eventos relevantes. | BACK-009 | Retención, deduplicación, privacidad y preferencias. | Aislamiento por destinatario, cursor estable y count consistente. |
| Mensajes | Conversaciones, mensajes, receipts y rate limit; realtime solo después de REST estable. | BACK-010 | Moderación, bloqueo/reportes, retención y cifrado en tránsito/reposo. | Solo participantes acceden; retry no duplica; paginación y lectura consistentes. |
| Búsqueda | Búsqueda global por tipo con índices PostgreSQL full-text/trigram. | BACK-015 | Política de perfil público y ranking. | P95 acordado, exclusión de drafts/borrados y resultados paginados por tipo. |
| Perfil público | Ruta frontend para GET usuario existente; después follow entre usuarios si producto lo aprueba. | Endpoint sin uso + BACK-018 | Privacidad de role/pueblo favorito y bloqueos. | Campos públicos mínimos; auto-follow prohibido; counts exactos. |
| Actividades | Lista de participantes para organizador/admin. | BACK-019 | Consentimiento para exposición pública. | Email nunca expuesto; 403 a terceros; total coincide con `participants_count`. |
| Administración | Users, métricas, suspensiones y audit log; conectar CRUD de pueblos ya existente. | BACK-020 + endpoints sin uso B.1 | Mínimo privilegio, último admin y moderación. | Toda mutación admin genera audit event; usuario normal recibe 403. |
| Shares | Tracking opcional y separado de Web Share local. | BACK-008 | Definir qué cuenta, privacidad e idempotencia. | Retry no duplica; contador atómico; el cliente nunca envía el total. |
| Observabilidad | Métricas RED, trazas por request_id, alertas de auth/5xx/latencia y frontend error reporting con redacción. | Transversal | Coste/retención y datos personales. | SLOs medibles, alertas accionables y runbook por fallo. |
| Rendimiento | Cache de GET públicos, invalidación tras mutación, optimización de imágenes y presupuestos de bundle/Web Vitals. | Transversal | No cachear flags privados como públicos. | Cache key separa estado anónimo/autenticado; métricas dentro del presupuesto acordado. |
| Base de datos | Índices guiados por query plans, mantenimiento, backups, restore drill y política de soft-delete/retención. | Transversal | Coste, RPO/RTO y cumplimiento. | Restore probado; queries críticas sin scans no previstos; índices medidos. |
| Escalabilidad | Jobs asíncronos para notificaciones/media, idempotency keys y límites por usuario/IP. | Transversal | Broker solo si volumen lo justifica. | Reintentos seguros, dead-letter observable y backpressure documentado. |
| Despliegue | Preview/QA/prod separados, migración `expand/migrate/contract`, canary/rollback y smoke post-deploy read-only. | Transversal | Compatibilidad de versiones FE/BE. | Rollback probado; frontend viejo y backend nuevo conviven durante ventana definida. |
| Experiencia móvil | Mejorar carga percibida, uso con red lenta, preferencias de reducción de movimiento y navegación con una mano. | Transversal | No implementar offline writes sin estrategia de conflictos. | Pruebas Slow 4G, skeletons estables, foco/scroll conservados y errores recuperables. |

## Evolución futura — producto territorial y escala

Horizonte sugerido: **cuando haya uso real, métricas y consentimiento**.

| Área | Evolución | Referencia | Condición para invertir | Criterio de éxito |
|---|---|---|---|---|
| Geolocalización | Coordenadas canónicas, GeoJSON, bbox/clustering y mapa accesible con alternativa en lista. | BACK-016 | Datos geográficos licenciados y necesidad validada. | Coordenadas reales, atribución correcta, rendimiento por zoom y uso completo sin mapa. |
| Recomendaciones | Recomendaciones explicables por follows/joins/saves, con opt-out. | BACK-017 | Colecciones personales completas y analítica consentida. | Razón visible, exclusión de bloqueados/borrados, sesgo y privacidad auditados. |
| Formatos sociales | Avisos oficiales, encuestas y adjuntos múltiples mediante schema discriminado. | BACK-021 | Comentarios/media/moderación estables. | Permisos de aviso, voto idempotente, cierre UTC y opciones inmutables con votos. |
| Tiempo real | SSE/WebSocket para mensajes/notificaciones, manteniendo REST como recuperación canónica. | BACK-009/010 | Volumen y latencia lo justifican. | Reconnect sin pérdida/duplicados y autorización por canal. |
| Escalabilidad | Cursores globales, particionado/archivado si los volúmenes lo exigen y workers horizontales. | Transversal | Evidencia de query plans/carga, no anticipación. | SLOs sostenidos con pruebas de carga y coste controlado. |
| Aplicación móvil/PWA | Instalabilidad, push consentido y lectura offline selectiva. | Móvil | API estable, estrategia de sesión segura y demanda demostrada. | Sin guardar JWT sensible en storage inseguro; sincronización/conflictos definidos; accesibilidad equivalente. |
| Confianza y comunidad | Reportes, bloqueo, apelaciones, moderación asistida y transparencia. | Administración futura | Crecimiento de contenido/usuarios. | SLA de revisión, audit trail y métricas de abuso sin sobreexponer datos. |
| Analítica de producto | Eventos mínimos, consentidos y con retención; funnels de descubrimiento/participación. | Observabilidad | Política de privacidad y esquema de eventos aprobado. | Decisiones basadas en métricas definidas, sin capturar contenido privado ni secretos. |

## Backlog frontend independiente del backend

Estas mejoras pueden planificarse sin inventar nuevas capacidades del servidor:

1. Añadir tests unitarios para adapters, session y error mapping.
2. Añadir tests de componentes para formularios y estados 401/409/422/red/timeout/204.
3. Ejecutar y automatizar matriz responsive/a11y.
4. Enviar filtros ya soportados por backend en vez de filtrar siempre en cliente, manteniendo límite explícito.
5. Crear ruta de detalle de post usando el GET existente solo después de validar UUID y UX de 404.
6. Conectar update/delete existentes únicamente tras definir ownership, confirmación y QA.
7. Retirar componentes/docs históricas no usadas después de confirmación, sin mezclarlo con funcionalidad.
8. Mantener logs de diagnóstico fuera de producción y preparar integración de error reporting sin datos sensibles.

## Indicadores de avance

| Indicador | Línea base de auditoría | Objetivo antes de producción |
|---|---|---|
| Flujos mutables E2E validados | 0 en esta auditoría | Registro, login, post, like/save, actividad, join/save, follow, perfil y logout en QA |
| OpenAPI con Bearer/response models | Incompleto | 100 % de operaciones protegidas y mutadores documentados |
| Tests backend | Archivo vacío; runner no declarado | Suite auth/CRUD/permisos/integridad en CI |
| Tests frontend | Sin scripts test/e2e | Unit/component + Playwright crítico en CI |
| Colecciones personales | Derivadas de catálogos o ausentes | Endpoints paginados de follow/join/save |
| Configuración mock/real | Riesgo híbrido local | Separación estricta por entorno |
| Responsive/a11y final | Revisión estática; ejecución pendiente | Matriz 375–1440 + teclado + axe sin críticos |
| Observabilidad | Errores UI y logs de desarrollo | request_id, logs redacted, métricas y alertas |

## Próximo paso concreto

Crear un entorno QA aislado con `USE_MOCK_DATA=false`, secretos rotados y DB descartable; implementar primero BACK-022/BACK-024/BACK-025 y una suite backend mínima. Después ejecutar el smoke completo con usuarios `qa_audit_<timestamp>`, registrar evidencias y actualizar la matriz sin tocar producción.
