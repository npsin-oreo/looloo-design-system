# Forbidden Patterns

Enforcement legend: 🔒 = checked by a script/CI today · 📋 = reported by an
audit script (`npm run audit:styles`, `audit:components`) · ⏳ = rule exists,
enforcement lands with a later phase.

## Styling

- 📋 Do not use `bg-white`, `text-black`, `border-gray-*` (or any raw neutral
  palette utility) in core components when semantic tokens exist.
  *Status: `npm run audit:styles` reports **0 HIGH** — the last violations
  (slider `bg-white` → `--slider-thumb-background`; alert-dialog/drawer/sheet
  `bg-black/10` scrims → `--surface-overlay`) were fixed in the
  component-tokenization phase.*
- 📋 Do not hardcode literal colors (`#hex`, `rgb()`, `oklch()`) in component
  source. (CSS-var plumbing like `var(--radix-*)` is fine.)
- ⏳ Do not hardcode height/padding/radius/font-size where a component token
  exists in `tokens/component/<name>.json`.
- 🔒 Do not edit generated CSS manually (`dist/tokens/*.css`) — the CI
  reproducibility + `tokens:css-check` jobs fail on any divergence from `tokens/`.

## Tokens

- Do not use `tokens/raw/*` in component source — raw is migration
  reference only.
- Do not put source names (`tw`, `rdx`, `shadcn`) in canonical token paths;
  origins belong in `$extensions`.
- 🔒 Do not hand-edit the generated subset of `tokens/` — only
  `tokens/theme/<brand>.json` is generated (`npm run tokens:theme` overwrites it);
  see the generated/hand-owned table in `tokens/README.md`.
- 🔒 New/changed aliases must pass `npm run tokens:validate`.
- Do not delete a token without a `$deprecated` note naming its replacement.

## Components

- Do not add a new variant without a Storybook story (CI render-smokes +
  axe-checks every story).
- Do not put product-specific logic or brand values inside core UI components
  — brands override `brand.config.json` (today) / theme tokens (v2).
- Do not change files under `components/ui/` without checking the public
  contract: every `components/ui/<name>.tsx` IS a published npm subpath
  (`@npsin-oreo/design-system/<name>`). Renames/moves require compatibility
  re-exports + a version bump + migration notes.

## Icons

- 📋 Do not import from `lucide-react` directly — import from
  `@/icons/icon-registry` (or use `<Icon>`/`<IconButton>`). Enforced by
  `npm run audit:icons` (0 HIGH). Sole allowlisted exception:
  `components/docs/references/icon-library.tsx` (docs gallery).
- 📋 Do not use inline `<svg>` / unregistered custom SVGs — customs live in
  `icons/custom/` and must be registered in `icon-registry.ts`.
- Do not add another icon library. `lucide-react` is the single icon source.
- Do not create icon-only buttons without an accessible label —
  `<IconButton>` makes `aria-label` a required prop; raw
  `<Button size="icon…">` needs `aria-label` or `sr-only` text
  (audit:icons WARNs on the former heuristic).
