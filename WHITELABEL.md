<div align="center">

# 🏷️ White-label & Per-brand Guide

**How to take this base and ship a fully-themed, handoff-ready design system for any brand — by changing one file.**

</div>

---

## Table of contents

- [The model](#the-model)
- [Architecture](#architecture)
- [Create a brand (step by step)](#create-a-brand-step-by-step)
- [`brand.config.json` reference](#brandconfigjson-reference)
- [Minimal config (seed only)](#minimal-config-seed-only)
- [Fonts per brand](#fonts-per-brand)
- [Staying in sync with the white-label base](#staying-in-sync-with-the-white-label-base)
- [Handoff checklist](#handoff-checklist)
- [Rules — do / don't](#rules--do--dont)
- [FAQ](#faq)

---

## The model

```
              main  (white-label base)
                │   components · scales · shadows · docs · agent rules
                │   default neutral theme
       ┌────────┼────────┬────────────┐
       ▼        ▼        ▼            ▼
  brand/acme  brand/duck  brand/looloo   …
   edits ONLY brand.config.json (colors + radius) + fonts
```

- **`main`** is the **white-label base** — the structure every brand inherits: the full shadcn/ui component library, the Atomic-Design showcase, the spacing / radius / type / shadow scales, the docs, and the AI-agent rules.
- **Each brand is a branch** (`brand/<name>`) off `main`. A brand branch changes **one file** — [`brand.config.json`](./brand.config.json) — plus fonts. Nothing else.
- Because brands only touch the brand layer, pulling improvements from the base (`git merge main`) **rarely conflicts**.

This makes the repo a **prompt-to-UI base**: a designer (or an AI agent) sets a brand's colors and immediately gets a correct, on-brand, handoff-ready system.

---

## Architecture

```
brand.config.json        ← the ONLY per-brand source (colors + radius)
   │   npm run brand:build   (auto-runs before dev & build)
   ▼
app/brand.css            ← AUTO-GENERATED :root + .dark   (never edit by hand)
   │   @import
   ▼
app/globals.css          ← structural @theme inline only  (shared, stable)
   │   · radius / spacing / type scales
   │   · shadow (effect) tokens
   │   · --color-* → var() mappings
   ▼
components/ui/*           ← consume semantic tokens (bg-primary, text-foreground …)
```

**Two layers, one rule:** values that differ per brand live in `brand.config.json`; everything structural lives in `globals.css`. Components never hardcode a color — they read semantic tokens, so a brand change propagates everywhere automatically.

Generator: [`scripts/build-brand.mjs`](./scripts/build-brand.mjs). It also **auto-derives** any missing `*-foreground` from its base color by relative luminance, so a partial config still yields readable pairs.

---

## Create a brand (step by step)

```bash
# 1. Branch off the white-label base
git checkout main && git pull
git checkout -b brand/acme

# 2. Edit the brand layer — at minimum set light.primary
#    (open brand.config.json; see the reference below)

# 3. Preview — brand.css regenerates automatically on dev
npm run dev            # http://localhost:3000

# 4. Commit & push the brand branch
git add brand.config.json app/brand.css
git commit -m "brand(acme): theme tokens"
git push -u origin brand/acme
```

Set `"name": "Acme"` in the config so the showcase and generated `brand.css` are labelled.

---

## `brand.config.json` reference

```jsonc
{
  "$schema": "./brand.schema.json",   // editor validation + autocomplete
  "name": "Acme",                      // shown in the showcase header
  "radius": "0.625rem",                // default corner radius (--radius)
  "fonts": { "sans": "Acme Sans", "mono": "Geist Mono" }, // metadata (see Fonts)
  "light": { /* token → color */ },
  "dark":  { /* token → color */ }
}
```

Tokens (each `light` / `dark` map). Values are CSS colors — hex (`#rrggbb`) or `rgb(r g b / a)`:

| Group | Tokens |
| --- | --- |
| **Base surfaces** | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground` |
| **Brand & status** | `primary`(+`-foreground`), `secondary`(+`-foreground`), `muted`(+`-foreground`), `accent`(+`-foreground`), `destructive` |
| **UI** | `border`, `input`, `ring` |
| **Chart** | `chart-1` … `chart-5` |
| **Sidebar** | `sidebar`(+`-foreground`), `sidebar-primary`(+`-foreground`), `sidebar-accent`(+`-foreground`), `sidebar-border`, `sidebar-ring` |
| **Extras** | `background-color` (overlay scrim), `semantic-background` / `-foreground` / `-border` |

> `destructive` is a single token (no `-foreground` pair) — matches the kit.

A `*-foreground` you omit is **auto-derived** by luminance (light text on dark surfaces, dark on light).

---

## Minimal config (seed only)

You don't have to fill every token. The smallest useful brand sets just the primary pair — foregrounds and the rest fall back to the inherited neutrals:

```json
{
  "$schema": "./brand.schema.json",
  "name": "Acme",
  "radius": "0.625rem",
  "light": { "primary": "#1455ff" },
  "dark":  { "primary": "#1455ff" }
}
```

`npm run brand:build` derives a readable `primary-foreground` automatically. Add more tokens (accent, ring, chart, sidebar…) as the brand needs them.

> Tip for prompts: *"Theme brand/acme with primary `#1455ff` and radius `0.625rem`"* is enough for an agent to produce a valid config.

---

## Fonts per brand

Fonts are real files, so they're swapped in **two** places (not the JSON):

1. Drop the font into [`app/fonts/`](./app/fonts).
2. Register it in [`app/layout.tsx`](./app/layout.tsx) with `next/font/local` and point `--font-sans` / `--font-mono` at it in [`app/globals.css`](./app/globals.css).
3. Record the family name in `brand.config.json` `fonts` (documentation only).

The base ships **Google Sans** (sans) + **Geist Mono** (mono). For Thai, append a Thai sans (Noto Sans Thai / IBM Plex Sans Thai) to the `--font-sans` stack.

---

## Sync tokens from Figma

If a brand's tokens come from a Figma DTCG export, you don't hand-copy values — import them:

```bash
# Replace tokens.json with the brand's Figma export, then:
npm run tokens:import            # tokens.json → brand.config.json (light)
# or point at any export:
npm run tokens:import path/to/acme-tokens.json
npm run brand:build              # regenerate app/brand.css
```

[`scripts/import-figma-tokens.mjs`](./scripts/import-figma-tokens.mjs) resolves the export's `shadcn-ui/Mode 1` semantic tokens (aliases → hex via `tw-colors` / `rdx-colors`), normalizes the kit's Figma typos (`backgrund` → `background`, `*-foregrund` → `*-foreground`, `Card` → `card`), and merges the result into `brand.config.json` `light`. Your `name`, `radius`, `fonts`, `dark`, and any non-exported extras are preserved.

> The export is **light-only** — `dark` is left untouched. Re-run after every Figma export to keep code and design in lockstep (no drift).

---

## Staying in sync with the white-label base

When the base gets new components, fixes, or docs:

```bash
git checkout brand/acme
git merge main          # brand layer is untouched → conflicts are rare
npm run dev             # verify
```

If a conflict ever happens, it's almost always inside `brand.config.json` / `app/brand.css` — keep your brand's values, take the base's everything-else.

---

## Handoff checklist

Before handing a brand to engineering:

- [ ] `brand.config.json` `name` set; colors filled for the brand
- [ ] `npm run build` passes (runs `brand:build` first)
- [ ] Light **and** dark reviewed in the showcase (toggle in header)
- [ ] Contrast checked on primary / accent / destructive pairs
- [ ] Fonts installed (`app/fonts/` + `layout.tsx`) if the brand differs from the base
- [ ] Branch pushed (`brand/<name>`) and linked in the handoff
- [ ] `DESIGN.md` still accurate, or note brand-specific deviations

---

## Rules — do / don't

**Do**
- Edit **`brand.config.json`** for any color/radius change, then `npm run brand:build`.
- Keep components using semantic tokens (`bg-primary`, `text-muted-foreground`).
- Branch per brand; merge `main` to pull base updates.

**Don't**
- ❌ Hand-edit `app/brand.css` (it's generated — your change is overwritten on next build).
- ❌ Put color values in `globals.css` `:root` / `.dark` (that layer is structural).
- ❌ Hardcode hex in components (`bg-[#1455ff]`) — add/adjust a token instead.
- ❌ Commit brand colors to `main` — that's the neutral white-label default.

---

## FAQ

**Where does the default (white-label) theme come from?**
`brand.config.json` on `main` holds the neutral shadcn theme, traced from the Figma export `tokens.json`. See [`DESIGN.md`](./DESIGN.md).

**Is `app/brand.css` committed?**
Yes — so a fresh clone builds without running the generator first. It's regenerated automatically before `dev`/`build`, so it always matches the config.

**Can one branch hold multiple brands?**
Production theming is one-brand-per-branch (the committed `brand.config.json`). For **previewing**, the showcase header has a **brand switcher** that tints the brand tokens at runtime (`components/showcase/brands.ts`) — handy to see the system under different brand colors without changing the branch's real theme. It doesn't write to `brand.config.json`.

**How does an AI agent theme a brand?**
Point it at `brand.config.json` (validated by `brand.schema.json`) and ask for a primary (and optionally accent/radius). The agent edits the config only — see [`CLAUDE.md`](./CLAUDE.md) and the bundled skill.
