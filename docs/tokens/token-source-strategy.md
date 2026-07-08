# Token Source Strategy (DS v2)

> Status: Phase 1. The canonical `tokens/` layer exists but is **not consumed at
> runtime yet** — the legacy pipeline stays authoritative until the Phase 2 build
> proves value-for-value parity.

## Why `tokens.json` is now legacy/raw

The root `tokens.json` is a 426 KB Figma DTCG export organized by **source**, not
by responsibility: `tw-colors/Mode 1`, `rdx-colors/light mode`, `brand-color/Mode 1`,
`shadcn-ui/Mode 1`, `$themes`, `$metadata`. That shape has served the current
pipeline, but it fails as a long-term source of truth because:

1. **No layer boundaries.** Nothing distinguishes primitive from semantic from
   component decisions, so humans and AI agents pick low-level tokens directly.
2. **Source leakage.** Components should not care whether a color came from
   Tailwind or Radix (`tw-blue-500`, `rdx-slate-9` are export artifacts, not names).
3. **Dead and misspelled data.** e.g. the `shadcn-ui/Mode 1` collection
   (`backgrund`, `Card-foregrund`) is consumed by nothing.
4. **No component layer.** Button height, table density, dialog width — the
   decisions products actually override — have no home in the export format.

So: `tokens.json` (and its byte-copy `tokens/raw/legacy.tokens.json`) is kept as
**migration reference, Figma backup, and legacy-pipeline input** — nothing more.
It is *not deleted* because the published package's `ds-brand-build` bin and the
CI drift job still read it.

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
3. **Determinism.** The CI drift job and the future `tokens:validate` /
   `token-contract.json` only work if values are fully repo-local.
4. **Offline/AI-safety.** Agents (Cursor, Claude) reason over files in the repo;
   values hidden inside `node_modules` invite hardcoded guesses.

Inspired values are therefore **copied and normalized in** (e.g. Tailwind's
palette is stored in `tokens/primitive/color.json` as `color.slate.500` with the
origin recorded in `$extensions["looloo.source"]`), never imported at build or
runtime.

## How future token changes are made

| Change | Where | Then |
|---|---|---|
| Brand colors / radius / fonts (today) | `brand.config.json` (root; brand branches) | `npm run brand:build` + `npm run tokens:migrate` to keep the canonical mirror in sync |
| New Figma export | `npm run tokens:import` → root `tokens.json` | `npm run tokens:data` + `npm run tokens:migrate` |
| Semantic roles (surface/content/border/status/interaction/focus) | hand-edit `tokens/semantic/*.json` | Phase 2+: `tokens:validate` + `tokens:build` |
| Component decisions | hand-edit `tokens/component/<name>.json` | must stay in sync with the component source until Phase 4 wires CSS vars |
| Density / contrast modes | hand-edit `tokens/mode/*.json` | not consumed until Phase 4+ |
| Product themes | hand-edit `tokens/theme/*.json` | scaffolds only until design signs off |

Rules that hold at every step:

- Never hand-edit generated files (`app/primitives.css`, `app/brand.css`,
  `tokens/raw/*`, the generated parts of `tokens/primitive|semantic/color.json` —
  see the generated/hand-owned table in [`tokens/README.md`](../../tokens/README.md)).
- Never put `tw`/`rdx`/`shadcn` in a canonical token path; sources belong in
  `$extensions`.
- New tokens that nothing consumes yet must carry
  `$extensions["looloo.status"] = "proposed"` so audits can tell aspiration from
  reality.
- Deprecations need a replacement note before deletion.
