# Changelog

All notable changes to `@npsin-oreo/design-system`. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/); this package follows semver.

## 1.0.0

First major. Completes the token-pipeline RFC
(`docs/rfc/retire-legacy-token-pipeline.md`): the canonical token source is now
hand-authored `tokens/**`, a **brand is a config/overlay** (not a git branch),
and the legacy `tokens.json` / `brand.config.json → app/*.css` pipeline enters a
one-release **deprecation window** before removal in 2.0.0.

### Compatible (nothing to do for most consumers)
- **Published CSS custom-property names are unchanged** — `dist/tokens/*.css` is
  byte-identical to 0.12.0 for the neutral (white-label) build. `--primary`,
  `--background`, `--surface-*`, `--ll-color-*`, … all resolve as before.
- `ds-brand-build`, `tokens.json`, and the root `token-contract.json` still ship
  and still work (see Deprecated).

### Breaking
- **`main` is now a neutral white-label.** The default brand is greyscale
  (`--primary = var(--ll-color-neutral-900)`), not teal. A product opts into a
  brand via an overlay (`brands/<name>.config.json` → `tokens/theme/<name>.json`),
  not by forking a branch. The Virtual Agent brand moved to
  `brands/virtual-agent.config.json` (+ `brands/virtual-agent/logo-artwork.tsx`).
- **`<Logo>` renders a neutral placeholder by default.** A bare `<Logo/>` no
  longer draws the Virtual Agent mark. Pass the brand vector explicitly:
  ```tsx
  import { Logo } from "@npsin-oreo/design-system/logo"
  import { virtualAgentLogoArtwork } from "@npsin-oreo/design-system/brands/virtual-agent/logo-artwork"
  <Logo type="lockup" artwork={virtualAgentLogoArtwork} />
  ```
  The default accessible label changed from `"Virtual Agent"` to `"Logo"`.
- **Component-tier colour tokens were collapsed into the semantic tier.** The old
  `--<component>-*` colour names are kept as thin aliases in `compat.css` for this
  one deprecation window and are **removed in 2.0.0** — migrate to the semantic
  token they point at (source of truth:
  `tokens/raw/deprecated-component-colors.json`).

### Added
- **Theme selection in the build.** `node scripts/tokens/build-css.mjs --theme=<brand>`
  compiles a brand's CSS into `dist/tokens/brands/<brand>/` (semantic resolves
  against `theme.<brand>.*`, still emitting `var(--ll-color-*)` — no `--theme-*`
  leak). No flag = the neutral white-label build.
- **`build-theme.mjs`** (`npm run tokens:theme`): `brand.config.json` (neutral) +
  every `brands/*.config.json` → `tokens/theme/<brand>.json` overlays.
- **`<Logo artwork>` slot** (`LogoArtworkSet`) with a neutral `defaultLogoArtwork`;
  brand geometry ships via the `./brands/<name>/logo-artwork` subpath. Logo colour
  still flows through `--ll-color-brand-*`, so only the vector is brand-specific.

### Deprecated (removed in 2.0.0)
The legacy token pipeline now prints a stderr banner when run:
- **`ds-brand-build`** / `npm run brand:build` (`scripts/build-brand.mjs`) →
  use the theme overlay + `tokens:theme` + `build-css --theme=<name>`.
- **`npm run tokens:data`** (`scripts/build-token-data.mjs`, `app/primitives.css`
  from `tokens.json`) → hand-authored `tokens/primitive/**` + `tokens:build`.
- **`npm run tokens:contract`** (`scripts/build-token-contract.mjs`, root
  `token-contract.json`) → the generated `.designops/token-contract.json`.

### Removed
- `scripts/tokens/migrate-legacy-tokens.mjs` and the `tokens:migrate` step —
  `tokens/**` is hand-authored; `tokens/raw/legacy.*.json` are frozen historical
  copies still read by `build-css` for the `--tw-*` / `--brand-*` compat aliases.
