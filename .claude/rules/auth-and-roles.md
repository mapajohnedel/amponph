---
paths:
  - "app/api/**"
  - "app/**/page.tsx"
  - "lib/**"
  - "middleware.ts"
  - "hooks/use-auth-user.ts"
---

# Auth and roles

## Roles

- Check roles only through `lib/auth/roles.ts` (`isAdminUser`, `isPartnerUser`,
  `getAuthenticatedHome`). Don't inline `user.app_metadata.role` checks.
- Roles come from `app_metadata` (server-controlled) and the admin email
  allowlist. **Never read a role from `user_metadata`** — users set it
  themselves via `signUp`/`updateUser`.
- Client-side role checks (`useAuthUser`, navbar, login pages) are for UX only.
  The server must enforce every one of them independently.

## Route handlers (`app/api/**/route.ts`)

Every handler, in this order:

1. `const supabase = await createClient()` from `@/lib/supabase/server`.
2. `supabase.auth.getUser()` — never `getSession()` on the server; it trusts the cookie unverified.
3. 401 when there's no user, 403 when the role is wrong — before reading the body or touching data.
4. Validate the body with a zod schema (`schema.parse`) before using it.
5. Do the work with the cookie client so RLS applies.

Public endpoints (e.g. submitting a partner application) are the exception;
they still validate input.

## Pages

Protected server pages call `getUser()` and `redirect()` themselves
(`/auth` when signed out, `getAuthenticatedHome(user)` when the role is wrong).
Middleware redirects too, but don't rely on it alone — its matcher skips `/api`.

## Service-role client

`lib/supabase/service-role.ts` bypasses RLS. Use it only:

- in server-only modules (`import 'server-only'`),
- after the caller's role was checked with the cookie client,
- for things RLS can't express (creating auth users, admin-wide reads).

Prefer an RLS policy or a `security invoker` RPC instead.

## Secrets

- Only `NEXT_PUBLIC_*` variables reach the browser. Service-role key and
  Cloudinary API secret never get that prefix and are read only in
  `server-only` modules.
- Cloudinary uploads go through the signed `/api/cloudinary/sign` route;
  deletions verify the image belongs to the caller's pet.

## Tests

A new or changed route gets a test in `tests/api/` covering at least:
signed out → 401, wrong role (including role only in `user_metadata`) → 403,
and the happy path. Copy the mocking pattern from
`tests/api/approve-adoption-request.test.ts`.
