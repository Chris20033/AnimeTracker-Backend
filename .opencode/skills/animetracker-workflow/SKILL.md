---
name: animetracker-workflow
description: Use when working on AnimeTracker features, backend, frontend, database, Docker, API endpoints, or roadmap tasks; requires checking project documentation before implementation and updating completed roadmap checkboxes.
---

# AnimeTracker Workflow

Use this skill for any AnimeTracker implementation, refactor, configuration, database, Docker, API, frontend, backend, or documentation task.

## Required Documentation Check

Before creating, modifying, or deleting project files, review the relevant documentation under:

`E:\Escritorio\Proyecto\AnimeTracker\Docs`

Prioritize these documents based on the task:

- `AnimeTracker/06 Roadmap/Plan de Sprints.md` for current sprint scope and completion tracking.
- `AnimeTracker/05 Arquitectura/Backend.md` for backend structure and layer responsibilities.
- `AnimeTracker/05 Arquitectura/Arquitectura del Sistema.md` for overall architecture decisions.
- `AnimeTracker/05 Arquitectura/Autenticación y Seguridad.md` for auth, JWT, roles, and security rules.
- `AnimeTracker/05 Arquitectura/Integraciones Externas.md` for external APIs such as Jikan.
- `AnimeTracker/08 API/API REST.md` and endpoint-specific files for API contracts.
- `AnimeTracker/04 Base de Datos/Diseño Lógico.md` and related DB files for Prisma/database changes.
- `AnimeTracker/03 Dominio/Reglas de Negocio.md` for validations and business rules.

Do not invent endpoints, models, fields, response formats, folders, or business rules when they are already documented.

If the documentation does not define the required behavior clearly, ask one concise question before implementing.

## Roadmap Checkbox Updates

Use `AnimeTracker/06 Roadmap/Plan de Sprints.md` as the source of truth for progress.

After completing a verifiable task:

- Mark its checkbox as `- [x]`.
- Only mark tasks that were actually implemented and verified.
- Do not mark tasks based on intent, partial work, or untested assumptions.
- If a task depends on external state such as Docker, PostgreSQL, migrations, lint, tests, or build, verify it before marking it.
- If implementation differs from documentation, update the related documentation or ask before proceeding when the change affects scope.

## Implementation Discipline

- Keep changes aligned with the current sprint unless the user explicitly expands scope.
- Implement all project changes inside this same AnimeTracker project/backend workspace unless the user explicitly gives another target path.
- Prefer the smallest correct implementation.
- Keep backend responsibilities separated by layer: routes, controllers, services, repositories, schemas, middlewares, utils.
- Keep Prisma access inside repositories or database configuration.
- Keep API responses aligned with `Convenciones de Respuesta.md`.
- Keep MVP scope first; avoid post-MVP items unless explicitly requested.

## Verification

Before closing work, run the most relevant available verification:

- Backend startup and health check for server/config changes.
- `npx prisma format` and `npx prisma generate` for Prisma schema changes.
- `docker compose config` for Docker Compose changes.
- `docker compose ps` or container health/status checks for Docker runtime changes.
- Migrations only when PostgreSQL is available and configured.

Report any task left unchecked and the exact reason.
