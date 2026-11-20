---
name: ampon-verify
description: Run AmponPH locally and check changed pages in Chrome as each relevant role (signed out, adopter, partner, admin), at phone and desktop width, in light and dark theme. Use after any UI change, when asked to check/screenshot/QA a page, or before saying a UI task is done.
---

# Verify in the browser

Type checks and unit tests don't show a page that overflows at 375px or turns
unreadable in dark mode. This skill looks at the real thing.

## 1. Decide what to check

From the diff (`git diff --stat` plus untracked files), list:

- **Pages** touched directly, plus pages that render a touched shared component
  (`grep -rl "<ComponentName" app components`).
- **Roles** that can reach each page:

| Route | Roles |
| --- | --- |
| `/`, `/browse`, `/browse/[id]`, `/privacy-policy`, `/terms-and-conditions` | signed out, adopter |
| `/auth`, `/partner/register`, `/admin/login` | signed out |
| `/dashboard`, `/account/password` | adopter (account page: every role) |
| `/partner/**` | partner |
| `/admin` | admin |

Navbar, footer, `theme-toggle` and `components/ui/*` changes affect every page:
check `/`, `/browse` and one page per signed-in role.

## 2. Start the app

Reuse a running dev server if `curl -sf http://localhost:3000 >/dev/null` succeeds.
Otherwise run `npm run dev` in the background and wait until that curl succeeds.
It needs `.env.local` with the Supabase variables; if it's missing, stop and tell the user.

## 3. Sign in

Ask the user for test credentials for each role you need, unless they've
given them in this conversation. Never create, approve or promote accounts
yourself to get a role, and never use real adopters' or partners' accounts.
Sign in through the UI (`/auth`, `/admin/login`). If a role is unavailable,
check what you can and say which role went unchecked.

## 4. Check each page

Load the Chrome tools (`claude-in-chrome` skill), open a new tab, and for each
page × role:

1. Width **375px** and **1280px** (`resize_window`).
2. Theme **light** and **dark** (navbar theme toggle).
3. Screenshot, then look for: horizontal scroll, overlapping or clipped text,
   unreadable contrast (light-only colours in dark mode), broken images,
   buttons wrapping badly, a skeleton that never resolves.
4. Exercise the changed interaction once (submit the form, open the dialog,
   apply the filter) and read the console for errors
   (`read_console_messages` with a pattern like `Error|Warning`).
5. Try long content and empty states where the page has them (a pet with a
   long name or description, a partner with no listings).

Don't approve or reject real adoption requests or partner applications, or
delete listings, unless the user said the data is test data.

## 5. Report

A short table per page: role × width × theme → OK / issue (with screenshot).
Fix issues your change caused; list pre-existing ones separately rather than
fixing them silently.
