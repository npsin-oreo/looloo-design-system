# themes/ (DS v2 scaffold)

Product/brand personality layers. **Status: structure only — nothing imports
these yet.** The live brand mechanism is the theme overlay: `brand.config.json`
(neutral) / `brands/<name>.config.json` → `npm run tokens:theme` →
`tokens/theme/<brand>.json` → `build-css` (a brand is a config overlay, not a git branch).

| Theme | Status | Bias |
|---|---|---|
| `neutral/` | active (base) | boring by design — docs, prototypes, pre-brand AI output |
| `looloo/` | proposed | placeholders aliasing `color.brand.*` ramps; awaiting design sign-off |
| `healthcare/` | proposed | comfortable density, strong focus, calm surfaces |
| (dashboard) | token-level only (`tokens/theme/dashboard.json`) | compact density; folder added when a product needs it |

Each theme: `theme.config.ts` (typed overrides of **token paths**, never
component source) + `theme.css` (placeholder — will be generated to
`dist/themes/<name>.css` by the token pipeline).

Rules:

- Themes override **semantic/component tokens**, not component source.
- Keep `neutral` boring; personality belongs in product themes.
- A theme's `overrides` keys must be canonical token paths (validated against
  `tokens/` by `npm run tokens:validate` once the pipeline compiles configs).
- Migration path for brand branches: brand.config.json → theme.config.ts, one
  brand at a time, only after the token pipeline proves parity.
