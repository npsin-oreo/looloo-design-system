# scripts/tokens/

Token tooling for the canonical `tokens/` layer (DS v2).

| Script | npm | Status |
|---|---|---|
| `build-theme.mjs` | `tokens:theme` | ✅ Phase 4 — `brand.config.json` → `tokens/theme/<brand>.json` (the brand's tunable scalars + colour roles). `--name` for per-brand overlays. Replaced `migrate-legacy-tokens.mjs`, which is deleted (`tokens/` is now hand-authored; the theme tier is the only generated file). `tokens/raw/legacy.*.json` are frozen historical copies, still read by `build-css` compat |
| `validate.mjs` | `tokens:validate` | ✅ structural validation (aliases, layers, override paths; theme tier merged into the resolution tree) |
| `build-css.mjs` | `tokens:build` | ✅ emits `dist/tokens/{primitive,semantic,component,compat}.css` + `modes/*.css` + `dist/themes/*.css`. `--theme=<brand>` builds a brand into `dist/tokens/brands/<brand>/`. Var naming: primitives `--ll-*` (Tailwind v4 owns `--color-…`/`--text-…`); semantic keeps shipped shadcn names (`--background`); compat re-emits `--tw-…`/`--brand-…` as aliases and `--rdx-…` as frozen literals (frozen historical — no active producer since v2.0.0) |
| `build-ts.mjs` | `tokens:build` | ✅ emits `dist/tokens/tokens.ts` (resolved values + `tokenVar()` helper) |
| `build-contract.mjs` | `tokens:build` | ✅ emits `.designops/token-contract.json` (v2 machine contract, deterministic) |
| `check-css-snapshot.mjs` | `tokens:css-check` | ✅ THE byte-identity gate: `dist/tokens/{primitive,semantic,component}.css` + `modes/dark.css` must match the golden snapshot in `.designops/css-snapshot/` (refresh ONLY on an intended output change). Replaced the legacy `diff.mjs` parity gate, removed with the legacy CSS in v2.0.0 |
| `audit-contrast.mjs` | `tokens:audit` | ✅ WCAG pairs, report-first (`--strict` to gate). Known: `muted` pair 4.34 (< AA, shadcn default), proposed `status.success` 3.30 — bump to green-700 before wiring |
| `lib-tokens.mjs` | — | ✅ shared loader/registry/resolver (path → css var + alias resolution) |

Convention: plain Node `.mjs` (matching the existing repo scripts) — no `tsx`
dependency until there is a real need.
