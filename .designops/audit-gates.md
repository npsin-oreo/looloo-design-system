# Audit Gates

Which checks **block CI** vs **report only** — the enforcement policy for the
quality gates wired in `.github/workflows/ci.yml`.

## Blocking (CI fails)

| Gate | Command | Why it can block |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | baseline |
| Theme-overlay drift | `tokens:theme` → `git diff tokens/` | the generated `tokens/theme/<brand>.json` must match its brand config(s); all other tiers are hand-authored |
| Token structure | `tokens:validate` | aliases/layers/overrides must resolve |
| **Byte-identity** | `tokens:css-check` | `dist/tokens/*` must match the golden snapshot in `.designops/css-snapshot/` (replaced the legacy `tokens:diff` parity gate, removed in v2.0.0) |
| Contract drift | `tokens:build` + `icons:contract` + `contracts:build` → `git diff .designops/` | contracts are generated; hand-edits and stale copies are bugs |
| Hardcoded styles | `audit:styles --strict` | reached 0 HIGH in the tokenization phase — gate keeps it there |
| Icon usage | `audit:icons --strict` | reached 0 HIGH in the icon phase — gate keeps it there (WARNs don't block) |
| Contrast (AA-large) | `tokens:audit --strict` | every live pair ≥ 3:1 today — gate keeps it there |
| Storybook render + axe | `test-storybook` | every story must render and pass a11y error-mode |

## Report-only (visibility, no block)

| Check | Command | Why not blocking |
|---|---|---|
| Component token coverage | `audit:components` | 18/56 by design — coverage grows with the P1→P2 rollout, not per-PR |
| Contrast AA-normal (4.5:1) | `tokens:audit` table | `muted` pair is 4.34 (shadcn default) and proposed `status.success` is 3.30 — design decisions, tracked with the theme sign-off |
| audit:icons WARNs | heuristic scan for `size="icon…"` without aria-label | sr-only text is a valid alternative the heuristic can't see |

## Local one-shot

```bash
npm run check   # typecheck + validate + build + diff + all strict audits
```

## Escalation rule

A report-only check becomes blocking only after it reaches (and should stay
at) zero — the styles and icons audits followed exactly that path. Never add
a blocking gate that is red at merge time.
