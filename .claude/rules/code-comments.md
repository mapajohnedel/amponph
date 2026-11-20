---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
  - "**/*.sql"
---

# Code comments

**Default to no comments.** Treat the urge to comment as a signal that the code
is not expressive enough yet. Well-named methods, small functions, named
constants, precise types, and well-named tests document behaviour better than
prose does — prose drifts out of date, code and tests cannot.

This is a gate, not a ban. Most comments die at the gate. The ones that survive
are legitimate; write those without ceremony.

## The gate — try these five first

1. Rename the variable, function, or class.
2. Extract the unclear block into a well-named function.
3. Replace the magic value with a named constant.
4. Tighten the type so the invariant is enforced, not described.
5. Write a test whose name states the behaviour.

If one of these removes the need for the comment, take that route instead. This
cuts both ways: once you have extracted `isListingExpired`, a
comment explaining that concept is a restatement. Delete it.

## Never write

- Restatements of the code — including of a name you just introduced.
- Structural narration: `// imports`, `// helpers`, `// main logic`.
- Change commentary: `// new`, `// changed from useEffect`. Git records this.
- Doc blocks that only restate a typed signature.
- Comments on obvious code: guard clauses, early returns, one-liners.
- Aspirational placeholders: `// TODO: handle errors` with no plan.
- Comments in tests. The test name and its arrangement are the documentation.

## What survives

A non-obvious **why** that genuinely cannot live in the code: a constraint the
code can't express (rate limit, protocol requirement, provider quirk, regulatory
rule); the reason a business rule exists when the rule itself is already named in
code; a workaround, with the upstream issue linked so it can be deleted when the
workaround dies; an ordering requirement the structure can't make explicit; a
footgun a reader would otherwise "clean up" and break.

Keep it to the why, one or two lines. Remove words until meaning is lost, then
add one back. No internal ticket, PRD, or build references — an upstream bug URL
is fine, `AMP-123` is not. No diff-relative narration ("previously", "now",
"before the fix", "legacy"). A comment longer than the code it explains is a
comment that should have been a function.

Match the file you are editing. If surrounding code is comment-free, add none.
Never add comments to a file as a side effect of an unrelated change. When I ask
you to explain code, explain it in the conversation — never by inserting
comments into the source.

## The test that decides it

> Would this comment make sense to someone reading the file who never saw the
> change?

If it only makes sense as an argument against a previous version of the code —
justifying what you picked, or warning off what you rejected — delete it. Say it
in your response to me instead.
