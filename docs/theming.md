# Theming (DS v2)

The v1→v2 migration is complete (see `docs/rfc/retire-legacy-token-pipeline.md`).
The legacy `brand.config.json → app/brand.css` pipeline and the `ds-brand-build`
bin were removed in **v2.0.0**. There is now one mechanism, split by audience.

## Internal (this repo): the token layer

```txt
brand.config.json (neutral)             hand-authored
brands/<name>.config.json (overlay)  ──npm run tokens:theme──▶ tokens/theme/<brand>.json
        │
tokens/{primitive,semantic,component,mode}  hand-authored
tokens/theme/<brand>.json                   (generated above)
        └──npm run tokens:build──▶ dist/tokens/*.css  (+ brands/<brand>/ with --theme)
                                        └──@import──▶ app/globals.css
```

- A brand is a **config overlay, not a git branch**. Semantic tokens stay
  brand-agnostic (they reference the theme tier); only the theme overlay carries
  brand values.
- Edit flow: change `brand.config.json` (neutral) or `brands/<name>.config.json`,
  then `npm run tokens:theme && npm run tokens:build`.
- `npm run tokens:validate` (structure) + `npm run tokens:css-check` (byte-identity
  of the published CSS) gate every change in CI.
- See [`tokens/README.md`](../tokens/README.md) for the generated-vs-hand-owned table.

## Consumers of the npm package

Import `@npsin-oreo/design-system/styles.css`, then override the semantic CSS
variables in your own `:root` / `.dark` — no build step. The themeable key list is
in `brand.schema.json` + `dist/tokens/semantic.css`. Full guide: root
[`THEMING.md`](../THEMING.md) (published inside the package).

`dist/tokens/compat.css` still re-emits the frozen `--tw-*` / `--brand-*` / `--rdx-*`
aliases for any older consumer output that referenced them.
