---
paths:
  - "supabase/migrations/**"
---

# Supabase migrations

Migrations in `supabase/migrations/` are applied by hand to the Supabase
project, in filename order. A file that sorts before one already applied, or a
change to a file already applied, silently never reaches the database.

## Naming

- Name new files with the real UTC timestamp:
  `supabase/migrations/$(date -u +%Y%m%d%H%M%S)_<snake_case_name>.sql`.
- Never hand-number (`<date>000000`, `<date>000100`, …). Two branches writing
  their first migration on the same day both claim `000000` and collide.
- Never edit or rename a migration that is already committed to `main`. Write
  a new one that alters what it did.

## Contents

- Every new table: `alter table … enable row level security;` plus its policies
  **in the same migration**. A table without RLS is readable by anyone holding
  the publishable key.
- Policies key ownership off `auth.uid()`, never off a column the client can write
  without a check (`with check` must constrain inserts/updates, not only `using`).
- Functions: `security invoker` and `set search_path = public` by default.
  `security definer` only when RLS genuinely can't express the rule; then
  re-check `auth.uid()` inside the function and `revoke execute … from public, anon`
  where the function isn't meant for signed-out users.
- Multi-row state changes (approve one request, reject the rest, update the pet)
  go in one RPC so they're atomic; raise with a specific `errcode` the route can
  map to an HTTP status (see `approve_adoption_request`).
- Make it re-runnable where cheap: `create … if not exists`,
  `create or replace function`, `drop policy if exists` before `create policy`.

## After writing one

Tell the user the migration must be applied to the Supabase project (SQL editor
or `supabase db push`) before the code that depends on it is deployed.
