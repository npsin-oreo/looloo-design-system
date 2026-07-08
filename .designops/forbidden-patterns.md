# Forbidden Patterns

Enforcement legend: 🔒 = checked by a script/CI today · 📋 = reported by an
audit script (`npm run audit:styles`, `audit:components`) · ⏳ = rule exists,
enforcement lands with a later phase.

## Styling

- 📋 Do not use `bg-white`, `text-black`, `border-gray-*` (or any raw neutral
  palette utility) in core components when semantic tokens exist.
  *Known debt: `components/ui/slider.tsx:52` uses `bg-white` — fix in the
  component-tokenization phase.*
- 📋 Do not hardcode literal colors (`#hex`, `rgb()`, `oklch()`) in component
  source. (CSS-var plumbing like `var(--radix-*)` is fine.)
- ⏳ Do not hardcode height/padding/radius/font-size where a component token
  exists in `tokens/component/<name>.json`.
- 🔒 Do not edit generated CSS manually (`app/primitives.css`, `app/brand.css`)
  — the CI token-drift job fails on any divergence from the sources.

## Tokens

- Do not use `tokens/raw/*` in component source — raw is migration
  reference only.
- Do not put source names (`tw`, `rdx`, `shadcn`) in canonical token paths;
  origins belong in `$extensions`.
- 🔒 Do not hand-edit the generated subset of `tokens/` (see the
  generated/hand-owned table in `tokens/README.md`) — `npm run tokens:migrate`
  overwrites it.
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

- ⏳ Do not import from `lucide-react` directly in NEW components — the icon
  registry + `Icon`/`IconButton` land in the icon phase; until then, follow
  `docs/icon-strategy.md`. (39 existing direct imports are known debt, migrated
  by codemod in that phase.)
- Do not add another icon library. `lucide-react` is the single icon source.
- Do not create icon-only buttons without an accessible label (`aria-label`).
