---
paths:
  - "app/**/*.tsx"
  - "components/**/*.tsx"
---

# Components over JSX variables

When a block of JSX needs pulling out of a component's return, extract a
component, not a `const panel = (<div>…</div>)` variable. A component gets a
name, typed props, its own state and a React DevTools entry, and keeps the
parent's return readable.

- Small inline choices are fine: `const icon = open ? <Up /> : <Down />`.
- Pass the parent's own elements as `children` when the parent must keep
  them (refs, handlers), e.g. `<EditorPanel><PetForm ref={…} /></EditorPanel>`.
- Reordering siblings by breakpoint: keep stable `key`s so React moves the
  elements instead of remounting them.
- Page files over ~300 lines (`app/admin/page.tsx`, `app/dashboard/page.tsx`)
  are the usual offenders: when you touch a section, extract it into
  `components/<area>/`. Apply to new or touched code; don't sweep whole files.
