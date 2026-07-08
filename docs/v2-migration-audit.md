# LOOLOO DS v2 Migration — Phase 0 Audit

> Generated 2026-07-08 as the baseline audit before any v2 structural change.
> Direction docs: `LOOLOO_DS_V2_TOKEN_STRUCTURE.md`, `LOOLOO_DS_V2_REPO_STRUCTURE.md` (external).
> Rule of the migration: **additive first — nothing that works today may break.**

## 1. Current state (baseline inventory)

### Token pipeline (today)

```txt
tokens.json (426 KB Figma DTCG export; source-prefixed collections:
             tw-colors / rdx-colors / brand-color / font / tokens(numeric px scale)
             / border-radius / height / gap / margin / padding / opacity
             / border-width / stroke-width / shadcn-ui / $themes / $metadata)
  ├─ scripts/build-token-data.mjs   → app/primitives.css   (--tw-*, --rdx-*, --brand-* in OKLCH)
  └─ scripts/build-brand.mjs        → app/brand.css        (semantic vars aliasing primitives)
       ↑ input: brand.config.json   (white-label; brands fork this file per branch)
scripts/build-token-contract.mjs    → token-contract.json  (themeable-key contract, v0.3.0)
scripts/import-figma-tokens.mjs     → refresh tokens.json from Figma export
app/globals.css                     → structural @theme (radius calc scale, fonts, shadows,
                                      --color-* → var(--*) mappings)
app/shadcn.css                      → keyframes + data-state custom variants
```

- Colors resolve: component `bg-primary` → `--color-primary` → `--primary` (brand.css) → `--tw-*` (primitives.css).
- Radix palette (`--rdx-*`) is generated but **nothing in `app/` or `components/` consumes it** (verified by grep).
- `shadcn-ui/Mode 1` collection in tokens.json has typo'd keys (`backgrund`, `Card-foregrund`) — it is not consumed by any script; brand.config.json is the actual semantic source.

### Package / consumers (real constraint)

- Published as `@npsin-oreo/design-system` **v0.3.0** on GitHub Packages.
- `exports`: `"./*" → ./components/ui/*.tsx` (**flat file paths** — folder-per-component restructure breaks subpath imports unless the exports map is updated in the same release).
- `bin: ds-brand-build` → `scripts/build-brand.mjs` reads the **bundled root `tokens.json`** → root tokens.json cannot be moved/deleted, only copied.
- `files` whitelist ships: app CSS ×4, components/ui, hooks, lib, 2 scripts, tokens.json, token-contract.json, brand.schema.json, THEMING.md.

### Components / Storybook / CI

- 51 flat components in `components/ui/*.tsx` (full shadcn library, base `radix-nova`, Tailwind v4, RSC).
- Storybook 10: 55 manual stories + 57 MDX docs in `stories/`; a11y + vitest addons; alias stub for `@/lib/design-tokens` (docs-site-only server module, intentionally absent here).
- CI (3 jobs): `tsc --noEmit` · **token-drift** (regenerates brand.css / token-contract.json / primitives.css and `git diff --exit-code`) · Storybook render+a11y tests via vitest/playwright.
- Icon usage: **39 files** import `lucide-react` directly (components/ui + stories). No icon registry, no `Icon` / `IconButton` component. `components.json` declares `iconLibrary: lucide`.
- No `tokens/`, no `themes/`, no `.designops/`, no component tokens, no mode (density/contrast) tokens.

### Gap vs v2 target (summary)

| v2 target | Today | Gap |
|---|---|---|
| `tokens/` canonical DTCG layers | `tokens.json` raw export only | **Phase 1–2** |
| token validate/build scripts | 4 ad-hoc `.mjs` scripts | **Phase 2** |
| folder-per-component + stories co-located | flat files + separate `stories/` | Phase 3 |
| component tokens | none (Tailwind utilities hardcoded) | Phase 4 |
| P3 coverage (combobox✓, date-picker✓, empty✓ …) | most P1/P2 already exist | Phase 5 (small) |
| icon registry + Icon/IconButton | direct lucide imports ×39 | Phase 6 |
| `.designops/` contracts, audit gates | token-contract.json only | Phase 7 |

## 2. Risks (ranked)

1. **Published-package breakage** — changing `exports`, `files`, or moving `tokens.json` / `build-brand.mjs` breaks v0.3.0 consumers and the `ds-brand-build` bin. → Root legacy files stay in place until a coordinated major/minor release; `tokens/raw/*` are *copies*, not moves.
2. **CI token-drift job** — it regenerates 3 committed files and fails on any diff. Any change to the legacy scripts or their inputs must keep output byte-identical (or update CI in the same PR). → Phase 1 does not touch the legacy pipeline at all.
3. **Brand branches** — brands fork only `brand.config.json`. The new canonical semantic layer must stay derivable from / compatible with `brand.config.json` until brands migrate. → Phase 1 *generates* semantic tokens from brand.config.json rather than hand-authoring divergent values.
4. **Name collisions across palettes** — `tw` and `rdx` both define `slate/gray/red/…`; canonical names must drop source prefixes. → Decision: **Tailwind families become canonical `color.<family>.<step>`; Radix stays raw-only** (it has zero consumers); brand ramps become `color.brand.<name>.<step>`.
5. **Storybook restructure (Phase 3)** — `.storybook/main.ts` globs `../stories/**`; co-locating stories requires glob + docs updates and a full Storybook test run.
6. **Icon migration (Phase 6)** — touching 39 files; must be codemod-style with compatibility (lucide stays a dependency).
7. **Future CSS var collisions** — emitting `--color-blue-500` from canonical tokens could collide with Tailwind v4's own theme namespace. Phase 2 must pick the emission prefix deliberately (e.g. keep primitives on a non-`--color-*` prefix).

## 3. Phase map (agreed)

| Phase | Scope | Destructive? |
|---|---|---|
| 0 | this audit | no |
| 1 | `tokens/` canonical structure (raw copies + primitive/semantic/mode/theme JSON + migrate script) | **no — purely additive** |
| 2 | `scripts/tokens/` validate + build pipeline → `dist/tokens/` (legacy pipeline untouched, outputs compared) | no |
| 3 | repo structure (folder-per-component with compat re-exports, exports map) | compat-gated |
| 4 | component tokens (P1 set) + wire variants to CSS vars | incremental |
| 5 | new components where useful (P3 gaps only) | no |
| 6 | icon registry + Icon/IconButton + codemod imports | compat-gated |
| 7 | `.designops/` contracts, forbidden patterns, audit gates in CI | no |

## 4. Phase 1 — exact changes (implemented in this pass)

**Added (nothing modified except one package.json script):**

```txt
docs/v2-migration-audit.md                     ← this file
tokens/README.md                               ← layer rules, decisions, status
tokens/raw/legacy.tokens.json                  ← byte-copy of tokens.json (root stays authoritative for legacy pipeline)
tokens/raw/legacy.brand.config.json            ← byte-copy of brand.config.json
scripts/tokens/migrate-legacy-tokens.mjs       ← deterministic generator: raw → canonical JSON below
tokens/primitive/{color,spacing,sizing,radius,typography,shadow,motion,opacity,border,z-index}.json
tokens/semantic/{color,status}.json            ← generated FROM brand.config.json (aliases into primitives)
tokens/mode/dark.json                          ← dark overrides from brand.config.json
tokens/theme/neutral.json                      ← white-label scalars (radius/fonts/axes)
tokens/component/.gitkeep                      ← reserved for Phase 4
package.json                                   ← + "tokens:migrate" script
```

**Explicitly NOT changed:** `tokens.json`, `brand.config.json`, all `app/*.css`, all legacy scripts, components, stories, CI, package `files`/`exports` (new `tokens/` is not yet shipped in the npm package — deliberate until Phase 2 outputs stabilize).

**Consumption status after Phase 1:** nothing imports `tokens/*` yet. The app/Storybook/package continue to run 100% on the legacy pipeline. `tokens/*` becomes load-bearing only in Phase 2 when `dist/tokens/*.css` is generated and compared against `app/primitives.css` + `app/brand.css` before any swap.
