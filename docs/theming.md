# Theming (DS v2 bridge)

Two systems exist during the migration — know which one is live:

## Live today: brand.config.json

The shipped mechanism (documented in root [`THEMING.md`](../THEMING.md), which
is published inside the npm package — that file stays authoritative for
consumers):

```txt
brand.config.json ──npm run brand:build──▶ app/brand.css (:root + .dark)
        ▲                                        ▲
   brand git branch                    consumers: npx ds-brand-build
```

- Brand forks change **only** `brand.config.json` (colors, radius, fonts,
  axes) — never `app/brand.css` or component source.
- Missing `*-foreground` values are auto-derived by luminance.
- `token-contract.json` (root) lists every key a brand may set.

## v2 target: tokens/ + themes/

```txt
tokens/{primitive,semantic,component}  base values
tokens/mode/{light,dark,compact,comfortable,high-contrast}  context overrides
tokens/theme/*.json + themes/<name>/theme.config.ts  brand personality
        └──token pipeline──▶ dist/tokens/*.css + dist/themes/<name>.css
```

Today `tokens/theme/{looloo,healthcare,dashboard}.json` and
`themes/{looloo,healthcare}/` are **proposed scaffolds** — placeholders
pending design decisions; nothing consumes them.

## Migration sequence (do not skip ahead)

1. Token pipeline emits `dist/` CSS and proves **var-for-var parity** with
   `app/primitives.css` + `app/brand.css`.
2. This repo's `app/globals.css` swaps its imports to `dist/tokens/*`.
3. Brand branches convert `brand.config.json` → `themes/<brand>/` one at a
   time (the config shape stays supported — `tokens:migrate` derives semantic
   tokens from it).
4. Density/contrast modes (`compact`/`comfortable`/`high-contrast`) wire up
   only after component tokens drive real CSS vars.

Until step 2 completes, **edit brand.config.json, run `brand:build`, and treat
everything under `themes/` as documentation of intent.**
