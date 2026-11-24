# ThriftSpot Frontend

Nuxt 4 app for ThriftSpot, a directory of thrift shops and secondhand items in Malaysia. Visitors browse items and shops. Signed-in users manage their shops and items and see view analytics. Admins manage roles and permissions.

The API lives in the sibling `thriftspot-backend` repo. Run it first (see its README).

## Stack

Nuxt 4, Pinia, Tailwind 4, shadcn-vue components, Axios. Vitest for unit tests.

## Setup

```bash
npm install
cp .env.example .env
```

`.env` needs one value, the API base URL **including `/api`**:

```
NUXT_PUBLIC_API_BASE=http://localhost:8000/api
```

Use `http://localhost:8080/api` if the backend runs in Docker.

```bash
npm run dev
```

The app is at `http://localhost:3000`. The backend's `CORS_ALLOWED_ORIGINS` must include that origin.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm test` | Vitest unit tests (`app/lib`) |
| `npm run typecheck` | `vue-tsc` type check |

## Structure

- `app/pages`: routes. Public: `/`, `/browse`, `/item/:id`, `/shops`, `/shops/:id`, `/about`. Signed in: `/dashboard`, `/shop`, `/items`, `/analytics`. Admin: `/admin/roles`.
- `app/services`: all API calls. Components use `useApi()` and never call Axios directly.
- `app/lib`: pure helpers (price formatting, shop form payloads, option lists) with tests.

Public pages load their data in the browser (`useAsyncData(..., { server: false })`) so the API's rate limiting sees each visitor's IP rather than the Nuxt server's.

## Demo login

If the backend was seeded locally, sign in with `admin@example.com` / `password`. You can also sign up for a regular account at `/auth/signup`.
