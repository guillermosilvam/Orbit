# Orbit — Backend API

Backend de **Orbit**, una API REST para gestionar proyectos y tareas en equipo (onda Linear o Jira, pero más directo). Todo se organiza por **workspaces**: dentro de cada workspace tienes proyectos, y cada proyecto maneja sus propias tareas con identificadores legibles como `WEB-12`. También hay manejo de roles por workspace para controlar quién puede hacer qué.

> **Nota:** La v1 del backend ya está lista y funcional. El frontend y las features de v2 vienen en la siguiente etapa.

---

## Stack y por qué elegí cada cosa

No quise meter herramientas solo porque estén de moda; cada pieza del stack tiene su razón de ser para el tamaño y objetivo de este proyecto:

* **Bun:** Lo usé como runtime y package manager porque es una tecnología moderna, bastante liviana y corre mucho más rápido que Node. Además te ahorra un montón de configuración: ejecuta TypeScript nativamente sin build step, lee el `.env` solo y ya trae su propio test runner.
* **Express:** Elegí Express porque es simple, directo y justo lo que necesitaba para este proyecto. No quise meter algo más pesado lleno de decoradores y boilerplate innecesario cuando con Express tengo control total de las rutas y middlewares sin complicarme la vida.
* **TypeScript:** Para atrapar errores mientras escribo código.
* **PostgreSQL 16:** El dominio es puramente relacional (workspaces -> proyectos -> tareas -> usuarios). Tener llaves foráneas, cascadas y constraints reales en la base de datos me evita tener que programar esa integridad a mano.
* **TypeORM:** Lo uso con el patrón Data Mapper y migraciones versionadas. `synchronize` está siempre en `false`; cualquier cambio en las tablas pasa sí o sí por una migración.
* **Zod:** Me permite validar los datos que entran por HTTP y, al mismo tiempo, inferir los tipos de TypeScript desde el mismo schema (`z.infer`).
* **Pino:** Logs estructurados en JSON y formateados de forma legible en consola cuando estoy desarrollando (`pino-pretty`).
* **Docker Compose:** Para levantar PostgreSQL en local con un solo comando sin tener que instalar nada en la máquina.
* **tsx:** Aunque Bun corre TS directo, el CLI de TypeORM está pensado para Node, así que uso `tsx` para ejecutar las migraciones sin problemas.

### ¿Por qué sesiones opacas y no JWT?

Para la autenticación opté por sesiones tradicionales guardadas en base de datos (un token aleatorio en una cookie `httpOnly` y su hash SHA-256 en Postgres) en lugar de JWT:

1. **Revocación al instante:** Si borro la fila de la tabla `sessions`, el usuario queda deslogueado en su siguiente petición. Con JWT tendrías que esperar a que expire el token o armar una lista negra en Redis, lo que al final vuelve a meter estado en el servidor.
2. **Menos superficie de error:** No hay secretos de firma que rotar ni problemas con algoritmos mal configurados.
3. **Seguridad por defecto:** Al ir en una cookie `httpOnly` con `SameSite=Lax`, el frontend no puede leer el token desde JavaScript (protege contra XSS) y se mitigan ataques CSRF básicos.

Si más adelante en la v2 hago la app móvil, siempre se puede pasar a un esquema híbrido sin tener que reescribir toda la lógica de negocio.

---

## Cómo está organizado el proyecto

La arquitectura sigue un flujo unidireccional clásico en capas: `routes → controller → service → repository`.

* **Routes:** Solo conectan la URL y el método HTTP con el controlador.
* **Controllers:** Reciben la petición, validan el body/params con Zod, llaman al servicio y devuelven la respuesta HTTP. No tienen lógica de negocio.
* **Services:** Aquí vive toda la lógica del negocio. Si algo falla, lanzan un `AppError`. No saben nada de `req` ni `res`, lo que hace que sean súper fáciles de testear.
* **Repositories:** Consultas a la base de datos usando TypeORM.

### Estructura de carpetas

```text
src/
├── modules/             # Cada feature tiene sus rutas, controller, service y DTOs
│   ├── auth/
│   ├── workspaces/
│   ├── projects/
│   ├── tasks/
│   └── invitations/
├── entities/            # Entidades de TypeORM (están globales para evitar imports circulares)
├── middlewares/         # Auth, verificación de roles, logger y manejador de errores
├── errors/              # Clase AppError y códigos de error estandarizados
├── config/              # Variables de entorno validadas con Zod y conexión a DB
├── logger/              # Configuración de Pino
├── types/               # Extensiones del Request de Express (req.user, req.workspace, etc.)
└── migrations/          # Historial de migraciones de la base de datos
```

*(Nota: Las entidades están fuera de `modules/` porque se relacionan entre sí y TypeORM necesita cargarlas todas juntas al iniciar; meterlas dentro de cada módulo terminaba generando dependencias circulares).*

### Decisiones técnicas interesantes

* **Manejo de errores centralizado:** Cualquier capa puede lanzar un `AppError` (ej. `AppError.notFound("Proyecto no encontrado")`). Un middleware al final de la cadena atrapa eso, los errores de Zod o cualquier fallo inesperado, y devuelve siempre el mismo formato JSON con un código estable (`NOT_FOUND`, `CONFLICT`, `VALIDATION_ERROR`, etc.) para que el frontend no dependa de textos.
* **Roles por workspace:** Un usuario puede ser `owner` en un workspace y simple `member` en otro. El middleware `requireWorkspaceRole` valida todo antes de llegar al controlador. Si alguien intenta entrar a un workspace del que no forma parte, la API responde `404` en lugar de `403` para no confirmar ni siquiera que ese workspace existe.
* **IDs legibles tipo `WEB-12`:** El identificador visual de la tarea no se guarda en la DB; se arma combinando la clave del proyecto con un número correlativo (`task.number`). Para evitar condiciones de carrera si dos personas crean una tarea al mismo segundo, cada proyecto tiene un `taskCounter` que se incrementa de forma atómica dentro de una transacción (`UPDATE projects SET task_counter = task_counter + 1 RETURNING task_counter`). Además, si borras una tarea, ese número nunca se reutiliza para no romper referencias en commits o chats.

### Modelo de datos (resumen)

```text
User ──< Session
User ──< WorkspaceMember >── Workspace ──< Project ──< Task
User ──< Invitation
Task >── User (assignee, opcional)
```

* **User:** Guarda email único y contraseña hasheada con Argon2id (usando `Bun.password`).
* **Session:** Guarda el hash del token y fecha de expiración.
* **Workspace & WorkspaceMember:** Maneja los espacios de trabajo y los roles (`owner`, `admin`, `member`). El dueño no se puede eliminar mientras tenga workspaces a su cargo (`RESTRICT`).
* **Invitation:** Tokens de un solo uso con expiración para invitar gente por enlace.
* **Project:** Tiene una `key` única por workspace (ej. `WEB`) que no se puede editar luego de crearse para no dañar los IDs de las tareas existentes.
* **Task:** Tiene número correlativo, estado, prioridad, fecha límite y un campo `position` de tipo numérico para poder reordenar tarjetas fácilmente en un tablero Kanban.

---

## Endpoints principales

Todas las rutas (salvo `/health`, `/auth/register` y `/auth/login`) piden que el usuario tenga una sesión activa mediante la cookie `session`.

### Auth
* `POST /auth/register` — Registro de usuario e inicio de sesión automático.
* `POST /auth/login` — Inicio de sesión.
* `POST /auth/logout` — Cierra sesión y limpia la cookie.
* `GET /auth/me` — Datos del usuario actual.

### Workspaces e Invitaciones
* `POST /workspaces` — Crear un workspace.
* `GET /workspaces` — Listar los workspaces donde participas.
* `GET /workspaces/:workspaceSlug` — Detalle del workspace (solo miembros).
* `DELETE /workspaces/:workspaceSlug` — Eliminar workspace (solo `owner`).
* `GET /workspaces/:workspaceSlug/activity?limit=20` — Actividad reciente de un workspace (máximo 50 eventos; solo miembros).
* `POST /workspaces/:workspaceSlug/invitations` — Generar invitación (`owner` / `admin`).
* `GET /workspaces/:workspaceSlug/invitations` — Ver invitaciones pendientes (`owner` / `admin`).
* `DELETE /workspaces/:workspaceSlug/invitations/:id` — Cancelar invitación (`owner` / `admin`).
* `GET /invitations/:token` — Ver info de una invitación antes de aceptarla.
* `POST /invitations/:token/accept` — Aceptar invitación y unirse al workspace.

### Proyectos y Tareas
* `POST /workspaces/:workspaceSlug/projects` — Crear proyecto (`owner` / `admin`).
* `GET /workspaces/:workspaceSlug/projects` — Listar proyectos (miembros).
* `GET /workspaces/:workspaceSlug/projects/:key` — Ver proyecto (miembros).
* `PATCH /workspaces/:workspaceSlug/projects/:key` — Editar proyecto (`owner` / `admin`).
* `DELETE /workspaces/:workspaceSlug/projects/:key` — Eliminar proyecto (`owner` / `admin`).
* `POST /workspaces/:workspaceSlug/projects/:projectKey/tasks` — Crear tarea (miembros).
* `GET /workspaces/:workspaceSlug/projects/:projectKey/tasks?status=` — Listar tareas, filtrable por estado (miembros).
* `GET /workspaces/:workspaceSlug/projects/:projectKey/tasks/:taskNumber` — Ver detalle de tarea (miembros).
* `PATCH /workspaces/:workspaceSlug/projects/:projectKey/tasks/:taskNumber` — Actualizar tarea (miembros).
* `DELETE /workspaces/:workspaceSlug/projects/:projectKey/tasks/:taskNumber` — Eliminar tarea (miembros).

---

## Levantar el proyecto en local

Necesitas tener instalado **Bun** (v1.1 o superior) y **Docker**.

```bash
# 1. Clonar el repo
git clone <repo-url> && cd orbit

# 2. Levantar la base de datos
docker compose up -d

# 3. Entrar al backend e instalar dependencias
cd api
bun install

# 4. Configurar variables de entorno
cat > .env <<EOF
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://orbit:orbit_dev@localhost:5432/orbit_dev
EOF

# 5. Correr las migraciones
bun run typeorm migration:run -d src/config/data-source.ts

# 6. Iniciar el servidor
bun run dev
```

La API queda escuchando en `http://localhost:3000`. Puedes probar que todo salió bien haciendo `GET /health`.

### Otros comandos útiles

* `bun run dev` — Levanta el servidor en modo watch.
* `bun run start` — Levanta el servidor sin watch mode.
* `bun run typecheck` — Revisa los tipos de TypeScript sin compilar archivos.
* `bun run db:up` / `bun run db:down` — Sube o baja el contenedor de Postgres.
* `bun run typeorm migration:generate -d src/config/data-source.ts src/migrations/Nombre` — Crea una nueva migración comparando entidades vs DB.
* `bun run typeorm migration:revert -d src/config/data-source.ts` — Revierte la última migración aplicada.

---

## Roadmap

### Lo que ya está listo (v1)
* Autenticación con sesiones opacas, cookies `httpOnly` y contraseñas con Argon2id.
* Workspaces multi-usuario con roles (`owner`, `admin`, `member`).
* Sistema de invitaciones por enlace con fecha de expiración.
* Proyectos con claves únicas y tareas con IDs legibles (`WEB-12`) generados de forma atómica.
* Manejo de errores centralizado, validación con Zod y logging estructurado.

### Lo que viene (v2)
* **Funcionalidades:** Backlog separado del tablero, comentarios e hilos en tareas, chat interno por workspace (con Socket.IO), sprints, notificaciones, adjuntos, transferencia de ownership, archivado (soft-delete) de proyectos y planes de suscripción.
* **Técnico:** Tests unitarios y de integración con Vitest, documentación autogenerada con OpenAPI/Swagger, seeds para probar con datos reales, envío de correos (Resend / SMTP) y pipeline de CI en GitHub Actions.

---

## Frontend y Móvil

El frontend se construirá por separado usando React, Vite, Tailwind y TanStack Query (con `dnd-kit` para el drag-and-drop del kanban). La API ya está pensada para ser consumida por esa interfaz y, más adelante, empaquetarla como app móvil con Capacitor.