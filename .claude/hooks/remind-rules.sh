#!/usr/bin/env bash
# Re-asserts .claude/rules/* after each Write/Edit. Rules load once per session;
# this fires every turn, so adherence stops decaying in long sessions.
# Bash is matched too: editing a source file through a redirect or a python
# heredoc would otherwise skip every rule silently.
set -euo pipefail

payload=$(cat 2>/dev/null || true)
[ -n "$payload" ] || exit 0

file=$(jq -r '.tool_response.filePath // .tool_input.file_path // empty' <<<"$payload" 2>/dev/null || true)
command=$(jq -r '.tool_input.command // empty' <<<"$payload" 2>/dev/null || true)

SOURCE_EXT='\.(ts|tsx|js|jsx|mjs|css|sql)'
reminders=()

if [ -z "$file" ] && [ -n "$command" ]; then
  redirect_write="(>>?[[:space:]]*[^[:space:]|&]*${SOURCE_EXT})"
  in_place_write="((sed|perl)[[:space:]]+[^|]*-i|tee[[:space:]]+[^|]*${SOURCE_EXT})"
  script_write="(open\(|writeFileSync|File\.(write|open))"

  if printf '%s' "$command" | grep -Eq "$redirect_write" ||
     printf '%s' "$command" | grep -Eq "$in_place_write" ||
     { printf '%s' "$command" | grep -Eq "$script_write" &&
       printf '%s' "$command" | grep -Eq "$SOURCE_EXT" &&
       printf '%s' "$command" | grep -Eq "[\"'](w|a)[\"']"; }; then
    reminders+=("You edited a source file through Bash, which skips the Write/Edit rule checks. Use Write or Edit for source files.")
    file=$(printf '%s' "$command" | grep -oE "[^[:space:]'\"|&<>]+${SOURCE_EXT}" | head -1 || true)
  fi
fi

[ -n "$file" ] || exit 0

case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.sql)
    reminders+=("code-comments.md: default to NO comments. Before writing one, try renaming, extracting, a named constant, a tighter type, or a test name. Delete restatement, structural narration, and change commentary. What survives is one non-obvious WHY in one or two lines. Never comment tests.")
    ;;
esac

case "$file" in
  */supabase/migrations/*|supabase/migrations/*)
    base=$(basename "$file")
    tracked=false
    git -C "${CLAUDE_PROJECT_DIR:-.}" ls-files --error-unmatch "$file" >/dev/null 2>&1 && tracked=true
    if [ "$tracked" = true ]; then
      reminders+=("supabase-migrations.md: $base is already committed and may already be applied to Supabase. Revert this edit and write a NEW migration that alters it.")
    elif printf '%s' "$base" | grep -Eq '^[0-9]{8}0{4}[0-9]{2}_'; then
      reminders+=("supabase-migrations.md: $base is hand-numbered (<date>0000NN) and will collide with other branches. Rename it to \$(date -u +%Y%m%d%H%M%S)_<name>.sql.")
    else
      reminders+=("supabase-migrations.md: new tables need RLS enabled + policies in this same migration; functions default to security invoker + set search_path = public. Tell the user to apply it to Supabase before deploying.")
    fi
    ;;
esac

case "$file" in
  */app/api/*route.ts|app/api/*route.ts)
    reminders+=("auth-and-roles.md: createClient() from lib/supabase/server -> getUser() -> 401/403 via lib/auth/roles BEFORE reading the body -> zod-parse the body -> work through the cookie client (RLS). Add/extend a test in tests/api/ (401, wrong role incl. user_metadata-only role, happy path).")
    ;;
esac

case "$file" in
  */lib/*|lib/*)
    if [ -f "$file" ] && grep -q "createServiceRoleClient" "$file" 2>/dev/null; then
      reminders+=("auth-and-roles.md: this file uses the service-role client (bypasses RLS). It must import 'server-only' and run only after the caller's role was checked; prefer an RLS policy or security invoker RPC.")
    fi
    ;;
esac

case "$file" in
  *.test.tsx) ;;
  */app/*.tsx|app/*.tsx|*/components/*.tsx|components/*.tsx)
    case "$file" in
      */components/ui/*|components/ui/*) ;;
      *)
        reminders+=("ui-conventions.md: shadcn primitives first; semantic colour tokens, and any hard-coded colour gets a dark: counterpart; new data routes get a loading.tsx skeleton; check 375px and 1280px in both themes (ampon-verify skill).")
        ;;
    esac
    ;;
esac

[ ${#reminders[@]} -gt 0 ] || exit 0

printf '%s\n' "${reminders[@]}" \
  | jq -Rs '{hookSpecificOutput: {hookEventName: "PostToolUse", additionalContext: ("Rules in force for this file — " + .)}}'
