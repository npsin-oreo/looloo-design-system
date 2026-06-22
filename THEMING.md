# Theming `@npsin-oreo/design-system`

The package ships a **neutral white-label theme** (`app/brand.css`, baked into
`styles.css`). You re-theme it per brand by overriding the semantic CSS variables.
You do **not** need to fork this repo.

The set of overridable tokens is published in
[`token-contract.json`](./token-contract.json) (`color_tokens` + `scalar_tokens`).

## Option 1 — generate a `brand.css` (recommended)

Write a `brand.config.json` in your app, then run the bundled themer:

```bash
npx ds-brand-build                 # reads ./brand.config.json → writes ./app/brand.css
npx ds-brand-build my.config.json out/brand.css   # explicit paths
```

`brand.config.json` accepts **either** shape:

```jsonc
// flat (e.g. DesignOps Step 2.6 output)
{ "project_name": "Acme", "primary": "oklch(0.45 0.18 264)",
  "background": "oklch(1 0 0)", "foreground": "oklch(0.15 0 0)",
  "radius": "0.5rem", "font_sans": "Inter" }

// nested
{ "name": "Acme", "radius": "0.5rem",
  "light": { "primary": "oklch(0.45 0.18 264)" },
  "dark":  { "primary": "oklch(0.65 0.18 264)" } }
```

Set at minimum `primary`. Any omitted `*-foreground` is auto-derived for contrast;
any token you don't set inherits the neutral base. Import the generated file **after**
the design system styles so its `:root` overrides win:

```ts
import "@npsin-oreo/design-system/styles.css"
import "./app/brand.css"   // your generated overrides
```

## Option 2 — inline CSS variables

Skip the build and override directly — keys must match `token-contract.json`:

```css
:root  { --primary: oklch(0.45 0.18 264); --background: oklch(1 0 0); }
.dark  { --primary: oklch(0.65 0.18 264); }
```

> A key the design system doesn't define is a silent no-op (the override just
> doesn't apply) — stick to the names in `token-contract.json`.
