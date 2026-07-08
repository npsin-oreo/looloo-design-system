# Component Guidelines (DS v2)

## Current vs target layout

**Today (public contract — do not break):** flat files. Every
`components/ui/<name>.tsx` is a published npm subpath
(`@npsin-oreo/design-system/<name>` via the `"./*"` exports wildcard), and
Storybook globs `stories/**` (`.storybook/main.ts`).

**Target (restructure phase):**

```txt
components/ui/button/
  button.tsx            # source
  button.stories.tsx    # co-located stories
  button.docs.mdx       # co-located docs
  index.ts              # re-exports
components/ui/button.tsx  # ← compatibility re-export kept until a major bump
```

`button.tokens.json` per-folder is intentionally NOT planned: the v2 spec
(§7) prefers `tokens/component/button.json` as the single source, which
already exists — a second per-folder copy would drift.

Why no component has moved yet: a move touches four contracts at once
(npm subpath, `@/` imports, Storybook glob, shadcn CLI paths). That lands as
its own batch with compatibility re-exports, an updated `exports` map, a
version bump, and a full `test-storybook` run — not piecemeal.

## Rules for every component (enforced progressively)

1. **Install via CLI**: `npx shadcn@latest add <name>` — never hand-write
   `components/ui/*` (CLAUDE.md rule).
2. **Semantic tokens only** in class strings: `bg-primary`,
   `text-muted-foreground`. Raw palette/literal colors are forbidden
   (`.designops/forbidden-patterns.md`; `npm run audit:styles` reports).
3. **Component decisions belong in `tokens/component/<name>.json`.** If you
   change a height/padding/radius in source, update the token file in the same
   commit (until the tokenization phase wires them automatically). Check
   coverage: `npm run audit:components`.
4. **Variants**: cva (`class-variance-authority`), variant logic readable,
   every new variant/size gets a Storybook story + token mapping. Variant
   extraction to `lib/variants/*` happens with the tokenization phase.
5. **Sizing idiom**: `size-4`, `gap-2` (never `w-4 h-4`, `space-y-*`);
   conditional classes via `cn()` from `@/lib/utils`.
6. **A11y**: visible focus (`focus-visible:ring-3 ring-ring/50` system),
   disabled states, keyboard support; icon-only controls need `aria-label`.
   CI runs axe on every story.
7. **Stories are the definition of done**: default + variants + sizes +
   states (+ icon usage where relevant). A component without stories is not
   stable.
8. **Density**: don't fork variants for density — density belongs to mode
   tokens (`tokens/mode/{compact,comfortable}.json`) once wired.

## Priority (from the v2 spec, mapped to this repo)

- **P1/P2 — all present** (51 components). Refactor order for tokenization:
  button → input → select → card → dialog → sheet → table → badge → sidebar.
- **P3 — add only on real product demand**: date-picker & data-table exist as
  stories today and get promoted to components only when a product needs them;
  icon & icon-button land in the icon phase.
