# EduNexus — Foundation Layer

This document describes the **structural foundation** of the project. Every new feature should build on these layers — not bypass them.

---

## Layer Stack

```
┌─────────────────────────────────────────────────────────┐
│  Pages / Features (UI, forms, business logic)           │
├─────────────────────────────────────────────────────────┤
│  Feature Hooks (useStudentProfile, useAdmissions, …)    │
├─────────────────────────────────────────────────────────┤
│  Services (src/services/*.service.ts)                   │  ← swap point
├─────────────────────────────────────────────────────────┤
│  Mock API  OR  HTTP Client (env.useMockApi)             │
├─────────────────────────────────────────────────────────┤
│  Config · Auth · Permissions · Routes · Env             │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Environment (`src/config/env.ts`)

All environment variables are read **once** through `env`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_APP_NAME` | EduNexus | Display name |
| `VITE_API_URL` | `/api/v1` | Backend base URL |
| `VITE_USE_MOCK_API` | `true` | Use mock data vs real HTTP |
| `VITE_ENABLE_DEVTOOLS` | `true` in dev | React Query devtools |

Copy `.env.example` → `.env.local` to customize.

**Rule:** Never use `import.meta.env` outside `src/config/env.ts`.

---

## 2. API Layer (`src/lib/api/`)

| File | Purpose |
|------|---------|
| `client.ts` | Axios instance, auth header, 401 logout, typed helpers |
| `errors.ts` | `parseApiError()`, `getErrorMessage()` — normalize all errors |
| `create-service.ts` | `createServiceMethod()` — mock/real routing |
| `query-keys.ts` | Centralized React Query cache keys |
| `index.ts` | Barrel exports |

### Service Pattern

Every data domain gets a service in `src/services/`:

```typescript
// src/services/example.service.ts
import { apiGet, createServiceMethod } from '@/lib/api'
import { fetchSomething } from '@/lib/mock-api'

export const exampleService = {
  getAll: createServiceMethod({
    mock: fetchSomething,
    api: () => apiGet<Thing[]>('/things'),
  }),
}
```

When the backend is ready: set `VITE_USE_MOCK_API=false` and implement the `api` handlers.

### Hook Pattern

```typescript
// src/features/example/hooks/useExample.ts
import { useApiQuery } from '@/hooks/useApiQuery'
import { queryKeys } from '@/lib/api'
import { exampleService } from '@/services'

export function useExample() {
  return useApiQuery(queryKeys.example.all, exampleService.getAll)
}
```

### Page Pattern

```tsx
const { data, isLoading, isError, error, refetch } = useExample()

if (isLoading) return <PageLoader />
if (isError) return <ErrorState error={error} onRetry={refetch} />
```

---

## 3. Authentication & RBAC

| File | Purpose |
|------|---------|
| `src/stores/auth.store.ts` | Session state (Zustand + persist) |
| `src/config/permissions.ts` | `MODULE_ACCESS`, `canAccessModule()` |
| `src/config/route-access.ts` | Path → module mapping |
| `src/app/router/ModuleGuard.tsx` | Route-level module guard |
| `src/app/router/RoleGuard.tsx` | Route-level role guard |
| `src/app/router/ProtectedRoute.tsx` | Auth gate |

### Access Control Rules

1. **Navigation** — filtered by role via `getNavigationForRole()` (includes children)
2. **Routes** — every module route wrapped in `ModuleGuard`
3. **Profile** — restricted to `student` and `parent` roles
4. **Direct URL access** — unauthorized users redirect to their default dashboard

---

## 4. Routing (`src/config/routes.ts` + `src/app/router/`)

- **Route constants** — use `ROUTES.STUDENTS`, never `'/students'` in new code
- **Lazy loading** — all pages imported via `lazy-pages.tsx` (code splitting)
- **Suspense** — `PageLoader` fallback while chunks load
- **404** — dedicated `NotFoundPage` instead of silent redirect

---

## 5. Error Handling

| Component | When to use |
|-----------|-------------|
| `ErrorBoundary` | Wraps entire app — catches render crashes |
| `ErrorState` | Query/mutation failures in pages |
| `PageLoader` | Loading states for pages and lazy routes |
| `EmptyState` | Zero data (not an error) |

Errors from the API layer are always `AppError` objects with `message`, `status`, `isUnauthorized`.

---

## 6. State Management

| Layer | Tool | Use for |
|-------|------|---------|
| Server state | React Query | API data, caching, mutations |
| Client state | Zustand | Auth, UI preferences (sidebar, theme) |
| Local state | `useState` | Form inputs, toggles, modals |

**Do not** put server data in Zustand. **Do not** call `mock-api` directly from pages — go through services.

---

## 7. Feature Module Structure

When building a new module, follow this layout (admissions is the reference):

```
src/features/{module}/
├── components/     # Module-specific UI
├── hooks/          # useApiQuery wrappers
├── pages/          # Route entry points
├── types/          # Domain types (optional)
├── api/            # Service methods if module-specific (optional)
└── data/           # Mock seed data (dev only)
```

Add a service in `src/services/{module}.service.ts` and register query keys in `query-keys.ts`.

---

## 8. Build & Dev

```bash
npm run dev        # Start dev server (port 5173)
npm run typecheck  # TypeScript check only
npm run build      # Production build
```

Vite proxies `/api` → `localhost:3000` for future backend integration.

---

## Migration Checklist (for existing pages)

Pages still calling `@/lib/mock-api` directly should be migrated:

- [ ] `StudentsPage` → `studentsService`
- [ ] `TeachersPage` → `teachersService`
- [ ] `ParentsPage` / `ParentProfilePage` → `parentsService`
- [ ] Dashboards → `dashboardService` + domain services
- [ ] LMS, Attendance, Exams, Fees, Reports pages
- [ ] `GlobalSearch`, `NotificationCenter`

Each migration: create/use service → update hook → use `ErrorState` on failure.

---

## What Makes This Foundation Strong

1. **Single swap point** — mock → real API via one env flag
2. **Enforced RBAC** — routes, nav, and permissions share one source of truth
3. **Typed errors** — consistent handling everywhere
4. **Code splitting** — lazy routes keep the bundle lean as modules grow
5. **Predictable structure** — every feature follows the same layers
6. **Documented patterns** — new developers know exactly where code goes

Build features **on top of** this foundation. Do not skip layers.
