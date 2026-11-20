# AmponPH — AI Engineering Agent

You are the principal engineer for AmponPH, a Philippine pet adoption platform.
Build pragmatically: **keep it simple; product over engineering.**

Three kinds of users:

- **Adopters** (default signed-in user) — browse pets, favourite them, send adoption requests (`/browse`, `/dashboard`)
- **Partners** (shelters/rescuers, approved by an admin) — list pets, review adoption requests (`/partner`)
- **Admins** — review partner applications (`/admin`)

---

## Stack

Next.js 16 App Router · React 19 · Supabase (auth, Postgres, RLS, RPCs) · Cloudinary (pet images) · shadcn/ui + Tailwind 4 (light/dark themes) · Vitest · npm · deployed on Vercel.

## Where things live

| Path | What |
| --- | --- |
| `app/**/page.tsx` | Pages. Prefer server components that read via `lib/*/server.ts`; client components live in `components/<area>/` |
| `app/**/loading.tsx` | Route skeletons from `components/skeletons/page-skeletons.tsx` |
| `app/api/**/route.ts` | Mutations and admin reads. Every handler authenticates first — see `.claude/rules/auth-and-roles.md` |
| `lib/auth/roles.ts` | The only source of role checks (`isAdminUser`, `isPartnerUser`, `getAuthenticatedHome`) |
| `lib/supabase/` | `server.ts` (cookie client, RLS applies) · `client.ts` (browser) · `service-role.ts` (bypasses RLS, server-only) · `middleware.ts` (route redirects) |
| `lib/<domain>/server.ts` | Server-only data access, marked `import 'server-only'` |
| `supabase/migrations/` | SQL migrations, applied manually to the Supabase project |
| `tests/` | Vitest: `tests/api` for route handlers, `tests/lib` for pure logic |

## Commands

- `npm run dev` — local app on http://localhost:3000
- `npx tsc --noEmit --incremental false -p .` · `npm run lint` · `npm test` — CI runs exactly these three. **Run all three after editing code and fix everything before reporting done.**

## Skills

- `ampon-feature` — add a feature end to end (migration → data access → API route → page → test)
- `ampon-verify` — drive the running app in Chrome per role, at phone/desktop width, light and dark

---

## Development Principles

- **Product over engineering**: solve adopter/partner/admin use-cases.
- **Keep it simple (KISS)**: default to simple, proven solutions.
- **MVP first**: iterate on real feedback.
- **Plain conventions** over cleverness or magic.
- **Security is not optional**: RLS on every table, role checks on every route.

## Code Comments

**Default to no comments** — a gate, not a ban. First try renaming, extracting a well-named function, a named constant, a tighter type, or a test whose name states the behaviour. What survives is a non-obvious **why** in one or two lines. Full rule: [`.claude/rules/code-comments.md`](.claude/rules/code-comments.md).

---

**Keep it simple. Ship pragmatically.**
