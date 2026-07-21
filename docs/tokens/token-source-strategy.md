# Token Source Strategy (DS v2)

> Status: **LIVE (migration complete).** `app/globals.css` imports the compiled
> canonical layer (`dist/tokens/*.css`); CI enforces byte-identity against the
> golden snapshot via `tokens:css-check`. The legacy `app/*.css` pipeline and the
> `ds-brand-build` bin were removed in **v2.0.0** — `tokens/**` is the single source.

## Why the old `tokens.json` export was retired

The root `tokens.json` was a 426 KB Figma DTCG export organized by **source**, not
by responsibility: `tw-colors/Mode 1`, `rdx-colors/light mode`, `brand-color/Mode 1`,
`shadcn-ui/Mode 1`, `$themes`, `$metadata`. It served the v1 pipeline but failed as
a long-term source of truth because:

1. **No layer boundaries.** Nothing distinguishes primitive from semantic from
   component decisions, so humans and AI agents pick low-level tokens directly.
2. **Source leakage.** Components should not care whether a color came from
   Tailwind or Radix (`tw-blue-500`, `rdx-slate-9` are export artifacts, not names).
3. **Dead and misspelled data.** e.g. the `shadcn-ui/Mode 1` collection
   (`backgrund`, `Card-foregrund`) is consumed by nothing.
4. **No component layer.** Button height, table density, dialog width — the
   decisions products actually override — had no home in the export format.

So the root `tokens.json` was **deleted in v2.0.0**. Its byte-copy
`tokens/raw/legacy.tokens.json` is kept as a frozen Figma reference, still read by
`build-css` only to emit the `--tw-*` / `--brand-*` / `--rdx-*` compat aliases.

## Why `tokens/{primitive,semantic,component,mode,theme}` is canonical

- **primitive/** — raw values with no UI meaning (`color.blue.500`, `space.2`).
  Normalized: source prefixes dropped, px→rem, OKLCH color space.
- **semantic/** — UI meaning (`color.primary`, `surface.card`, `focus.ring.*`).
  What components and themes are supposed to talk to.
- **component/** — per-component decisions (`button.height.md`,
  `table.headerHeight`) captured 1:1 from the shipped radix-nova components.
  The missing layer in v1; prerequisite for density modes.
- **mode/** — light (base), dark, and the proposed compact / comfortable /
  high-contrast overrides.
- **theme/** — product personality (neutral = white-label today; looloo /
  healthcare / dashboard are scaffolds pending design decisions).

Each layer may only reference the layers below it (validated from Phase 2):
`component → semantic → primitive`; modes and themes override existing paths.

## Why we do NOT import token values from external packages

Tailwind, Radix, shadcn/ui, and Astryx are **references, not dependencies**:

1. **Stability.** A minor bump of an upstream package must never silently
   re-color a shipped product. Our values change only via a reviewed commit.
2. **Ownership.** Brand and product decisions live in this repo; an external
   palette can't encode LOOLOO decisions.
3. **Determinism.** The CI reproducibility job, `tokens:validate`, and
   `tokens:css-check` only work if values are fully repo-local.
4. **Offline/AI-safety.** Agents (Cursor, Claude) reason over files in the repo;
   values hidden inside `node_modules` invite hardcoded guesses.

Inspired values are therefore **copied and normalized in** (e.g. Tailwind's
palette is stored in `tokens/primitive/color.json` as `color.slate.500` with the
origin recorded in `$extensions["looloo.source"]`), never imported at build or
runtime.

## How future token changes are made

| Change | Where | Then |
|---|---|---|
| Brand colors / radius / fonts | `brand.config.json` (neutral) or `brands/<name>.config.json` (overlay) | `npm run tokens:theme && npm run tokens:build` |
| New Figma export | `npm run tokens:import` (into `tokens/`) | reconcile by hand — the primitive/semantic tiers are hand-authored |
| Semantic roles (surface/content/border/status/interaction/focus) | hand-edit `tokens/semantic/*.json` | Phase 2+: `tokens:validate` + `tokens:build` |
| Component decisions | hand-edit `tokens/component/<name>.json` | must stay in sync with the component source until Phase 4 wires CSS vars |
| Density / contrast modes | hand-edit `tokens/mode/*.json` | not consumed until Phase 4+ |
| Product themes | hand-edit `tokens/theme/*.json` | scaffolds only until design signs off |

Rules that hold at every step:

- Never hand-edit generated files (`dist/tokens/*.css`, `tokens/theme/<brand>.json`,
  `tokens/raw/*` — see the generated/hand-owned table in
  [`tokens/README.md`](../../tokens/README.md)).
- Never put `tw`/`rdx`/`shadcn` in a canonical token path; sources belong in
  `$extensions`.
- New tokens that nothing consumes yet must carry
  `$extensions["looloo.status"] = "proposed"` so audits can tell aspiration from
  reality.
- Deprecations need a replacement note before deletion.
