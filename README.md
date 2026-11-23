# Orbit

Orbit es una aplicación para la gestión de proyectos pensada para equipos pequeños. Permite organizar el trabajo en espacios de trabajo, crear proyectos y asignar tareas a los miembros del equipo.

La aplicación incluye autenticación, invitaciones, tableros Kanban, miembros con roles y un registro básico de actividad.

## Tecnologías

- React y Vite para el frontend
- Bun y Express para el backend
- PostgreSQL para la base de datos
- Docker Compose para levantar PostgreSQL

## Inicio rápido

Requisitos: Bun y Docker.

```bash
# Instalar dependencias
bun install

# Levantar PostgreSQL
docker compose up -d

# Ejecutar las migraciones
cd api
bun run typeorm migration:run -d src/config/data-source.ts

# Iniciar el backend
bun run dev
```

En otra terminal, inicia el frontend:

```bash
cd web
bun run dev
```

La web estará disponible en `http://localhost:5173` y la API en `http://localhost:3000`.
