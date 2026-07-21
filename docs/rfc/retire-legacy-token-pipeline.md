# RFC — Retire the legacy token pipeline + retire the brand-git-branch model

*(make `tokens/` the single source of truth; make a brand a config/overlay, not a repo branch)*

Status: **Decisions resolved — Phase 3 in progress** · Owner: DS · Created 2026-07-21 · Extends `docs/v2-migration-audit.md`

## 1. Problem

Two coupled problems, one root cause (brand values baked into generated files instead of being a thin overlay):

### 1a. Two token pipelines; `tokens/` is generated, not authored

- `tokens:migrate` (`scripts/tokens/migrate-legacy-tokens.mjs`) regenerates `tokens/primitive/*`,
  `tokens/semantic/{color,status}.json`, `tokens/mode/dark.json`, `tokens/theme/neutral.json`
  from root `tokens.json` (Figma export) + `brand.config.json` on every run — a CI drift gate
  (`migrate` + `git diff --exit-code tokens/`) means those files **cannot be hand-edited**.
- Consequences: (a) to change a semantic color you edit `brand.config.json` or the migrate
  *script*, never the token file; source of truth is split across brand.config + migrate script +
  the hand-owned files (`semantic/{surface,interaction,focus}.json`, `component/*`); (b) the
  token→UI path is 4 hops (`brand.config → migrate → tokens/semantic → build-css → dist → Tailwind`)
  — "edit token, see UI" is impossible for the generated tiers.

### 1b. "Brand" is a git branch, not a config

`brand/virtual-agent` was created as a whole-repo branch off `main` on the mental model
"main = white-label, branch = brand." That model's **concept is right** (verified: `main`'s
`brand.config.json` is genuinely neutral white-label — `primary: oklch(0.205 0 0)`, chroma 0
greyscale; the branch overrides to teal `oklch(0.54 0.082 198.255)` + `radius 0.75rem` + Noto Sans
Thai + a logo), but the **implementation is the anti-pattern**: a git branch of the *entire* DS
accumulates BOTH brand identity AND general DS development, so:

- `main` falls behind (missing chat components, the PR #33 color-tier collapse, etc.).
- Every DS update must be merged into every brand branch → divergence + maintenance tax.
- The branch's 110-file diff vs main is really **~5 brand files + ~13 derived + ~92 general** (see §8).

**Goal (combined):** `tokens/` becomes the single hand-authored source of truth AND a brand becomes
a small **config/overlay consumed from the one white-label package** — never a repo branch. One
direct path `tokens/*.json → build-css → dist → UI`; brand = `brand.config.json` (+ a logo asset).

## 2. Hard constraints (why this is non-trivial)

- **A. Published-package consumers (v0.3.0)** import root `tokens.json`, use `build-brand.mjs`,
  and the `ds-brand-build` bin. Removing/moving legacy files breaks them → gated by a **major** bump.
- **B. Brand branches fork ONLY `brand.config.json`** — that single file is today's entire
  brand-customization surface. Semantic tokens are generated *from* it so forks keep working. Naive
  hand-authoring of semantic tokens removes brands' single override point.

## 3. New brand mechanism (resolves B)

**Keep `brand.config.json`, repurpose it** from "source expanded into files" → "thin build-time input."

- Semantic tokens (`tokens/semantic/*`) become **100% hand-authored and brand-agnostic** — they
  define ROLES that reference **theme-tier aliases**, not brand values.
- Brand values live in **`tokens/theme/<brand>.json`** — a hand-authorable DTCG overlay (the
  `tokens/theme/` tier already exists, e.g. `neutral.json`). One per brand.
- New **`scripts/tokens/build-theme.mjs`** does a narrow, deterministic map: `brand.config.json`
  (short list: primary/accent hue-chroma, radius, fonts, density/motion axes) → `tokens/theme/<brand>.json`
  as `{primitive.*}` aliases. This is *only* the brand-color→alias mapping — NOT the full
  primitive/semantic/mode regeneration `migrate` does today.
- **Brand-branch migration, low churn:** feed each branch's `brand.config.json` once through
  `build-theme.mjs` → commit the materialized `tokens/theme/<brand>.json`. Support **both** input
  paths (brand.config regeneration AND direct theme-file editing) through the transition; deprecate
  the JSON-input path at the major bump. Brand PR workflow is unchanged near-term; hand-authoring is
  opt-in per branch. Offer a one-command `tokens:adopt-theme` seed.

## 4. Sequencing — flip *authoring* before *distribution*

The npm boundary is the hard gate, not internal repo structure. Decouple **what generates tokens**
(can change anytime) from **what ships** (only changes at a major, must stay byte-identical).

| Phase | Scope | Consumer-visible? |
|---|---|---|
| **3** | Split `migrate`: stop it regenerating `primitive/*` + `semantic/{color,status}.json` (seed once, then hand-authored). Keep it only for dark/theme deltas until Phase 4. **Replace the drift gate** on now-hand-authored tiers with a **schema/contract gate** (alias refs resolve, no orphans, contract snapshot matches `build-contract.mjs`); narrowed drift gate stays only on still-generated files. | no |
| **4** | Land `build-theme.mjs`; retire the rest of `migrate-legacy-tokens.mjs`. Root `tokens.json`/`brand.config.json` remain but have **no in-repo build consumers** — `tokens/` is self-sufficient. One-time proof: byte-diff resolved CSS custom properties (legacy vs `tokens/`) before deleting anything. | no |
| **4b** | **Retire the brand-git-branch model** (§8). Land the ~92 general-DS files from `brand/virtual-agent` onto `main`; keep `main`'s neutral white-label `brand.config.json`; extract virtual-agent's identity to `tokens/theme/virtual-agent.json` (+ its `brand.config.json`) + a **logo slot**; the consuming app builds its brand from the one white-label package. Then `brand/virtual-agent` the *branch* is retired. | no (internal) |
| **5** | *(gated by A)* `v0.4.0-next` prerelease: ship CSS built from `tokens/` under the **same custom-property names** (contract-tested vs `token-contract.json` + `.designops/token-contract.json` so no property rename leaks). Deprecation window + runtime warning on `ds-brand-build` bin + `tokens.json` import. Cut **`v1.0.0`** dropping legacy files/scripts; replace the bin with a thin wrapper over `build-css.mjs` if still needed. | **yes (major)** |
| **6** | Delete root `tokens.json`/`brand.config.json`, `import-figma-tokens.mjs`, `build-brand.mjs`, `build-token-data.mjs`, `build-token-contract.mjs`, `migrate-legacy-tokens.mjs`, `app/brand.css`, root `token-contract.json`. Archive to `archive/legacy/` per repo convention. | cleanup |

**Phases 3–4 start now** (internal-only, invisible to consumers as long as published CSS output
stays byte-identical). Only Phase 5 waits for the major.

## 5. End state — one direct path

**Survives:** `tokens/{primitive,semantic,component,theme,mode}/*.json` (hand-authored SoT) ·
`build-css.mjs` → `dist/tokens/*.css` · `build-contract.mjs` → `.designops/token-contract.json` ·
new `build-theme.mjs` (thin brand.config→theme mapper, optional) · `brand.config.json` demoted to a
per-brand authoring convenience (one per branch). `import-figma-tokens.mjs` **rewritten** to write
`tokens/primitive/*.json` directly (Figma = input to primitives only, a tool not a pipeline stage).

**Deleted (post-major):** root `tokens.json` + `brand.config.json`, `build-brand.mjs`,
`build-token-data.mjs`, `build-token-contract.mjs`, `migrate-legacy-tokens.mjs` + `tokens:migrate`
CI job, `app/brand.css`, root `token-contract.json`.

**Path:** `tokens/*.json` (edit) → `build-css.mjs` → `dist/tokens/*.css` → Tailwind. One hop.
"Edit token, see UI" true for every tier.

## 6. Risks / de-risking

- **Silent contract drift breaking consumers at the major** → run a **continuous** CSS-output diff
  (legacy `app/brand.css` vs new `dist/tokens/*.css` resolved values) in CI through the *whole*
  transition, not just at cutover. Turns Constraint A into a standing regression check.
- **Brand branches rot mid-flight** → support both input paths through Phases 4–5 (no lockstep
  forced move); one-command seed for branch owners.
- **Drift gate goes quiet/meaningless** when tiers move generated→hand-authored → replace
  "diff after regenerate" with "schema/contract validation" that still fails loudly on bad hand-edits.
- **Scope creep into full DTCG tooling** → keep Phases 3–4 mechanical & behavior-preserving (same
  resolved values, same names); nicer authoring ergonomics is a separate later initiative.

## 7. Decisions — RESOLVED (recommended defaults, 2026-07-21; adjust if needed)
1. **Reduced `brand.config.json` schema** → keep the current surface (it's already a good short list): `light`/`dark` color roles (primary/secondary/accent/destructive/muted/… hue-chroma), `radius`, `fonts.{sans,mono}`, `axes.{ease,duration,leading,tracking,weight_heading,container,section}`. No expansion.
2. **`tokens/theme/<brand>.json` structure + selection** → DTCG overlay `{ theme: { <brand>: { color:{…{primitive.*} aliases…}, radius, … } } }`; `build-css` selects via a `--theme=<brand>` flag (default = `neutral`/white-label). Overlays sit beside the existing `tokens/theme/neutral.json`.
3. **`v1.0.0`** → **yes**, cut a major at Phase 5 (repo is pre-1.0, but consumers exist → prerelease + one-minor deprecation window first, then v1.0.0).
4. **"White-label" on `main`** → **neutral greyscale** (current state). Brands are pure overlays; `main` never carries brand hue.
5. **Logo** → DS ships a **placeholder Logo + `artwork` slot/prop**; the brand overlay / consuming app supplies the real artwork (per-brand SVG). No brand logo baked into white-label.
6. **`virtual-agent`** → **in-repo overlay** `tokens/theme/virtual-agent.json` (looloo's own reference brand, convenient to ship); genuinely external brands would instead be separate consumers (fork `brand.config.json` + build).

## 8. Repo topology — retire the brand-git-branch model (merge `virtual-agent` → `main`)

**Finding:** `main` is genuine white-label (neutral greyscale `brand.config.json`); `brand/virtual-agent`
is `main` + general DS dev + a small teal-brand skin. The 110-file branch diff splits cleanly:

| bucket | ~count | what | where it goes |
|---|---:|---|---|
| **BRAND (identity)** | 5 | `brand.config.json` (teal, radius 0.75, fonts), `components/ui/logo/*` (3), `app/layout.tsx` font wiring | → `tokens/theme/virtual-agent.json` overlay + its `brand.config.json` + a **logo slot/asset**. NOT baked into white-label `main`. |
| **DERIVED** | ~13 | `tokens/primitive/{color,radius,typography}.json`, `semantic/color.json`, `mode/dark.json`, `theme/neutral.json`, `app/brand.css`, `app/primitives.css`, `token-contract.json`, `.designops/*`, `tokens.json`, `legacy.*` | regenerated per active config — **neutral on `main`**, teal on the virtual-agent overlay. Never hand-split. |
| **GENERAL DS** | ~92 | `tokens/component/*` (color-tier collapse), 12 repointed `components/ui/*`, `stories/manual/*`, `scripts/tokens/*`, `docs/rfc`, `status.json` surfaces, compat map, `package.json`, `.storybook` … | → **`main`** (white-label). This is the bulk; it's plain DS work with no brand values. |

**Merge sequence (all internal, no consumer break):**
1. Land the ~92 GENERAL files on `main` (bring white-label up to date: chat, PR #33 collapse, RFCs, scripts). DERIVED files regenerate from `main`'s neutral `brand.config.json` → `main` stays neutral.
2. Extract virtual-agent identity: `tokens/theme/virtual-agent.json` (from its `brand.config.json` via `build-theme.mjs`, §3) + keep its `brand.config.json` as the brand input; move the **logo** behind a slot (`<Logo artwork={…}/>` or app-provided asset) so white-label ships a placeholder.
3. The consuming app (e.g. the virtual-agent prototype) builds its brand from the **one** white-label package + its overlay — exactly the `brand.config.json` + `ds-brand-build` (→ later `build-theme.mjs`) model the DS already documents ("*Fork this file per brand, then run `brand:build`*").
4. Retire the `brand/virtual-agent` **branch**. New brands = a `tokens/theme/<brand>.json` (or forked `brand.config.json`), never a repo branch.

**Why it's safe/small:** the true brand surface is ~5 files (mostly one config + the logo); the other 105 are general or auto-derived. The architecture already supports this — the git branch just conflated identity with development.
