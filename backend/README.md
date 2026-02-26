# Backend – Veille réglementaire QSE

Backend NestJS avec Prisma (PostgreSQL) pour l’application de veille réglementaire QSE.

## Prérequis

- Node.js 18+
- PostgreSQL
- Variables d’environnement (voir `.env.example`)

## Installation

```bash
npm install
cp .env.example .env   # puis éditer DATABASE_URL et JWT_SECRET
npx prisma generate
npx prisma migrate dev # création des tables
```

## Scripts

- `npm run start` – démarrage
- `npm run start:dev` – mode watch
- `npm run build` – build production
- `npm run prisma:generate` – régénérer le client Prisma
- `npm run prisma:migrate` – migrations
- `npm run prisma:studio` – interface Prisma Studio

## Structure des modules

| Module | Description | Endpoints principaux |
|--------|-------------|----------------------|
| **Auth** | JWT, login/register, profil | `POST /auth/login`, `POST /auth/register`, `GET /auth/profile` |
| **Regulation** | CRUD réglementations, filtres | `GET/POST /regulation`, `GET/PATCH/DELETE /regulation/:id` |
| **Compliance** | Conformité client / texte | `GET /compliance/client/:clientId`, `PATCH /compliance/:id`, `POST /compliance` (admin) |
| **ActionPlan** | Plans d’action par client | `GET/POST /action-plan`, `GET/PATCH/DELETE /action-plan/:id` |
| **Dashboard** | Statistiques | `GET /dashboard/stats?clientId=...` |
| **Notification** | Cron J-2 (minuit) | Rappels actions à échéance dans 2 jours (logs) |

## Sécurité

- Guard JWT global ; routes publiques avec `@Public()` (login, register).
- Rôles : `ADMIN_CYRUS` (accès complet), `CLIENT_USER` (données de son client uniquement).
- Création/modification des réglementations et des mappings de conformité : réservé aux admins.

## Bonnes pratiques

- DTOs avec `class-validator`.
- Filtre d’exceptions global.
- Prisma en module global.
- Configuration via `ConfigModule` et `.env`.
