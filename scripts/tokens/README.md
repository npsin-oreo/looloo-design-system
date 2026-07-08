# scripts/tokens/

Token tooling for the canonical `tokens/` layer (DS v2).

| Script | npm | Status |
|---|---|---|
| `migrate-legacy-tokens.mjs` | `tokens:migrate` | ✅ regenerates the generated subset of `tokens/` from root `tokens.json` + `brand.config.json` |
| `validate.mjs` | `tokens:validate` | ✅ structural validation (aliases, layers, override paths) |
| `build-css.mjs` | `tokens:build` | ✅ emits `dist/tokens/{primitive,semantic,component,compat}.css` + `modes/*.css` + `dist/themes/*.css`. Var naming: primitives `--ll-*` (Tailwind v4 owns `--color-…`/`--text-…`); semantic keeps shipped shadcn names (`--background`); compat re-emits `--tw-…`/`--brand-…` as aliases and `--rdx-…` as frozen literals for published `ds-brand-build` consumers |
| `build-ts.mjs` | `tokens:build` | ✅ emits `dist/tokens/tokens.ts` (resolved values + `tokenVar()` helper) |
| `build-contract.mjs` | `tokens:build` | ✅ emits `.designops/token-contract.json` (v2 contract, deterministic; the ROOT `token-contract.json` stays the published/legacy contract) |
| `diff.mjs` | `tokens:diff` | ✅ THE parity gate: every legacy var in `app/primitives.css` + `app/brand.css` must resolve identically on the dist side (684+41+35+2 checked). Consumer swap is forbidden while this is red |
| `audit-contrast.mjs` | `tokens:audit` | ✅ WCAG pairs, report-first (`--strict` to gate). Known: `muted` pair 4.34 (< AA, shadcn default), proposed `status.success` 3.30 — bump to green-700 before wiring |
| `lib-tokens.mjs` | — | ✅ shared loader/registry/resolver (path → css var + alias resolution) |

Convention: plain Node `.mjs` (matching the existing repo scripts) — no `tsx`
dependency until there is a real need.
