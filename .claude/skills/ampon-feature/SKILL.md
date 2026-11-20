---
name: ampon-feature
description: Add or change an AmponPH feature end to end — Supabase migration with RLS, server-only data access in lib/, an authenticated API route, the page/component with a loading skeleton, and Vitest coverage — then run the CI checks. Use when building a new feature, adding a table/column/RPC, adding an API endpoint, or adding a page for adopters, partners or admins.
---

# Ship a feature

AmponPH features follow one path through the stack. Do the layers in this
order, skipping any the feature doesn't need, and don't report done until the
last step passes.

## 0. Scope it

Before writing code, state in two or three lines: which role(s) use it
(adopter / partner / admin), what data it reads or writes, and which existing
feature it most resembles. Read that feature's files first and copy their shape:

| Closest to… | Read |
| --- | --- |
| Partner action on their own records | `app/api/adoption-requests/[id]/approve/route.ts`, `supabase/migrations/20261009000200_approve_adoption_request_rpc.sql` |
| Admin review flow | `app/api/partner-applications/**`, `lib/partner/server.ts`, `lib/partner/applications.ts` |
| Public listing / browse | `lib/pets/server.ts`, `app/browse/**` |
| Adopter per-user data | `app/api/favorites/route.ts`, `supabase/migrations/20260421000100_create_favorite_pets_table.sql` |

If the feature is ambiguous on product behaviour, ask the user before building.

## 1. Migration (if the schema changes)

Follow `.claude/rules/supabase-migrations.md`:

```bash
touch "supabase/migrations/$(date -u +%Y%m%d%H%M%S)_<snake_case_name>.sql"
```

- Table → RLS enabled + policies keyed on `auth.uid()` in the same file.
- Multi-row state change → one `security invoker` RPC raising specific `errcode`s.
- Write the policies as if the browser talks to the table directly — it can.

## 2. Data access (`lib/<domain>/`)

- Server reads go in `lib/<domain>/server.ts` with `import 'server-only'`, using
  `createClient()` from `@/lib/supabase/server`.
- Shared types and zod schemas (used by both the form and the route) go in a
  plain module, e.g. `lib/<domain>/<thing>.ts`.
- Map snake_case rows to camelCase app types in one function in this layer.

## 3. API route (`app/api/**/route.ts`) — for mutations and admin reads

Follow `.claude/rules/auth-and-roles.md` exactly: `getUser()` → 401/403 via
`lib/auth/roles.ts` → zod-parse body → work through the cookie client → map
RPC `errcode`s to 404/409, everything else 500. Return `{ error }` on failure
and `{ success: true, message }` (or the resource) on success, like the
existing routes.

## 4. UI

- Server component page (`app/<area>/…/page.tsx`) that checks the user and
  redirects like `app/partner/requests/page.tsx`, reads via step 2, and renders
  client components from `components/<area>/` for interactivity.
- Client components call the API route with `fetch`, show the result with a
  Sonner toast, then `router.refresh()`.
- Add `loading.tsx` with a skeleton from `components/skeletons/page-skeletons.tsx`.
- Follow `.claude/rules/ui-conventions.md` (tokens + `dark:`, shadcn first, mobile first).
- Link it from wherever the role will find it (navbar, dashboard tab, partner home).

## 5. Tests

- Route: `tests/api/<feature>.test.ts`, mocking `@/lib/supabase/server` the way
  `tests/api/approve-adoption-request.test.ts` does. Cover signed out → 401,
  wrong role (and role only in `user_metadata`) → 403, invalid body → 400,
  happy path, and each mapped error code.
- Pure logic (schemas, mappers, formatters): `tests/lib/`, `it.each` for variants.
- No tests that only assert static content rendered.

## 6. Verify

```bash
npx tsc --noEmit --incremental false -p . && npm run lint && npm test
```

All three must pass (lint warnings are allowed, errors are not). If the UI
changed, run the `ampon-verify` skill on the touched pages.

## 7. Report

Tell the user, briefly:

- what changed, per layer;
- **any migration that must be applied to Supabase before deploy** (filename);
- any new env var to add in Vercel (and `.env.example`);
- what you verified and what you couldn't (e.g. no test account for a role).
