---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
  - "app/globals.css"
---

# UI conventions

## Building blocks

- Use the shadcn primitives in `components/ui/` (Button, Dialog, Select, Tabs,
  Sonner toasts…) before writing a custom one. Add a missing one with
  `npx shadcn@latest add <name>`; don't hand-roll it.
- Icons from `lucide-react`. Wrap page content in `site-container`.
- Forms: `react-hook-form` + a zod schema shared with the API route that
  receives it (e.g. `lib/partner/applications.ts`).

## Theming (light + dark)

- Prefer semantic tokens: `bg-background`, `bg-card`, `text-foreground`,
  `text-muted-foreground`, `border-border`, `bg-primary`… They switch with the
  theme for free.
- A hard-coded colour (`bg-[#fff8f2]`, `from-[#ffefe6]`, `bg-white`) must ship
  with its `dark:` counterpart in the same class list — the existing pages
  follow this pattern (`dark:bg-card/85`, `dark:from-primary/10`, the
  `--page-gradient-from/to` tokens). Never add a light-only colour.
- New design tokens go in `app/globals.css` in both `:root` and `.dark`.

## Loading and navigation

- A new route that fetches data gets a `loading.tsx` rendering a skeleton
  from `components/skeletons/page-skeletons.tsx` (add one there if none fits).
  No spinners for page loads.
- After sign-in/sign-out use `navigateAfterAuthChange()` from
  `lib/auth/navigation.ts`, not `router.push`.

## Responsive

- Mobile first; check every touched page at 375px and 1280px wide, in both
  themes. Long names, long descriptions and empty states must not overflow.
- To actually look at it, use the `ampon-verify` skill.
