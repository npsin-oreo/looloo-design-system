# scripts/tokens/

Token tooling for the canonical `tokens/` layer (DS v2).

| Script | npm | Status |
|---|---|---|
| `migrate-legacy-tokens.mjs` | `tokens:migrate` | ✅ regenerates the generated subset of `tokens/` from root `tokens.json` + `brand.config.json` |
| `validate.mjs` | `tokens:validate` | ✅ structural validation (aliases, layers, override paths) |
| `build-css.mjs` | `tokens:build` | ⏳ token-pipeline phase — emits `dist/tokens/*.css`; must prove var-for-var parity with `app/primitives.css` + `app/brand.css` before anything swaps. Primitive vars must NOT use the `--color-*` prefix (taken by Tailwind's `@theme inline` in globals.css) |
| `build-ts.mjs` | `tokens:build` | ⏳ token-pipeline phase — emits `dist/tokens/tokens.ts` |
| `build-contract.mjs` | `tokens:build` | ⏳ token-pipeline phase — emits `.designops/token-contract.json` (v2 contract; the ROOT `token-contract.json` stays the published/legacy contract) |
| `diff.mjs` | `tokens:diff` | ⏳ token-pipeline phase — diffs generated output vs the legacy CSS |
| `audit-contrast.mjs` | `tokens:audit` | ⏳ quality-gates phase — WCAG AA pairs check |

Convention: plain Node `.mjs` (matching the existing repo scripts) — no `tsx`
dependency until there is a real need.
