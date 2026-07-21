# Theming `@npsin-oreo/design-system`

The package ships a **neutral white-label theme** (baked into `styles.css`). You
re-theme it per brand by overriding the semantic CSS variables in your own app —
you do **not** fork this repo or run any build step.

> **v2.0.0:** the old `ds-brand-build` generator and the shipped
> `token-contract.json` were removed. Theming is now pure CSS-variable overrides.

## Override the semantic variables

Import the design system styles, then define your overrides **after** them so your
`:root` wins:

```ts
import "@npsin-oreo/design-system/styles.css"
import "./app/brand.css"   // your overrides (below)
```

```css
/* app/brand.css */
:root {
  --primary: oklch(0.45 0.18 264);
  --primary-foreground: oklch(0.98 0 0);
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.65 0.18 264);
}
```

Set at minimum `--primary` (+ its `--primary-foreground` for contrast); any variable
you don't set inherits the neutral base.

## Which variables can I set?

The full set of themeable roles is the shadcn-compatible semantic layer the package
ships. Two authoritative references, both in the package:

- **`dist/tokens/semantic.css`** — the live `:root` role names (`--primary`,
  `--background`, `--card`, `--popover`, `--muted`, `--accent`, `--destructive`,
  `--border`, `--input`, `--ring`, each with a `-foreground` where relevant), plus
  `--radius` and the non-colour axes.
- **[`brand.schema.json`](./brand.schema.json)** — the machine-readable list of
  themeable keys (`light` / `dark` colour roles, `radius`, `font_sans` / `font_mono`,
  and the `axes`). Useful if you generate overrides programmatically.

> A variable the design system doesn't define is a silent no-op (the override just
> doesn't apply) — stick to the names above.

## Colour format

Use OKLCH (what the package uses). A role and its `-foreground` should meet WCAG AA
contrast; the neutral base is already AA-safe, so verify any pair you change.
