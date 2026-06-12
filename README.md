<div align="center">

# 🎨 → 💻 &nbsp; Design → Dev Handoff

**A production-grade Next.js handoff kit — Figma design tokens + the full shadcn/ui component library, synced 1:1 from Figma.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-56_components-000000)](https://ui.shadcn.com/)
[![Figma MCP](https://img.shields.io/badge/Figma-Dev_Mode_MCP-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/)

</div>

---

## What is this?

A ready-to-hand-off repository that bridges **design and engineering**. Designers export tokens from Figma; developers get a typed, themed, fully-stocked component library that renders **byte-identical** to the design — plus a live showcase to browse it all.

> **Mental model:** Figma is the source of design intent *and* token values. This repo mirrors it — automatically, documented, and tamper-evident.

### Highlights

| | |
| --- | --- |
| 🎯 **1:1 tokens** | Every color/radius/font in `app/globals.css` is the exact output of the Figma export [`tokens.json`](./tokens.json) |
| 🧩 **Full library** | All **56** shadcn/ui components in `components/ui/` — source you own, ready to use |
| 🔭 **Live showcase** | Browse every component, organized by **Atomic Design**, at `/` |
| 🤖 **Agent-ready** | A bundled skill enforces strict Figma fidelity for AI-assisted coding |

---

## 🚀 Quick start

```bash
git clone https://github.com/npsin-oreo/Hand-off-test.git
cd Hand-off-test

npm install
npm run dev
```

Open **<http://localhost:3000>** to explore the component showcase.

> 💡 To render *exactly* like Figma, also install the kit fonts (Inter · Geist Mono) — see [Fonts](#-fonts).

### Install as a component package

For local handoff testing, install this repository from the consuming app:

```bash
npm install ../Hand-off-test
```

Import the shared stylesheet once in the consumer's root layout, then import
components directly from the package:

```tsx
import "@looloo/design-system/styles.css"
import { Button } from "@looloo/design-system/button"
import { Card, CardContent } from "@looloo/design-system/card"
```

Next.js consumers must add `@looloo/design-system` to `transpilePackages` because
the handoff package publishes typed component source rather than generated
bundles.

---

## 🔭 Component showcase

A living preview where **each component has its own page** with **Preview + Code** tabs. Use the sidebar to jump anywhere.

| Route | Shows | Count |
| --- | --- | :---: |
| `/` | **Foundations** — color, typography, spacing, radius, elevation, border (live tokens) | — |
| `/atoms` · `/atoms/{id}` | **Atoms** — overview grid + one page per component | 20 |
| `/molecules` · `/molecules/{id}` | **Molecules** | 21 |
| `/organisms` · `/organisms/{id}` | **Organisms** | 14 |

Each component page shows a **Preview** tab (live, interactive) and a **Code** tab (copy-paste usage snippet in Geist Mono).

---

## 🎨 Design tokens

Tokens follow a **three-tier model** (full reference in [`DESIGN.md`](./DESIGN.md)):

```
Tier 1 · Primitives   raw Tailwind / Radix sRGB     (neutral.900, blue.9 …)
Tier 2 · Semantic     --primary, --background …      (:root / .dark)
Tier 3 · Utilities    bg-primary, text-muted-fg …    (@theme inline)
```

Components only ever use **Tier 3**. Tier-2 names match the Figma variable names 1:1, so `get_variable_defs` returns `primary` → you write `bg-primary`. No translation.

| Category | Scale | Source |
| --- | --- | --- |
| **Color** | 31 standard + 4 kit-specific, light + dark | `shadcn-ui` token set |
| **Radius** | `xs…4xl` = 2 / 4 / 6 / 8 / 12 / 16 / 24 / 32 px | Tailwind v4 static scale |
| **Spacing** | every `p-/m-/gap-/size-*` = `n × 4px` | Tailwind v4 |
| **Typography** | full size / weight / leading / tracking | Tailwind v4 + Figma `family/*` |

> ⚠️ **Re-theme by re-exporting from Figma** — never hand-edit a value or run `apply --preset`. That breaks the 1:1 match. See [`DESIGN.md` §2](./DESIGN.md).

<details>
<summary><b>Known caveats from this Figma export</b></summary>

<br>

- **Light mode only** — the export ships no dark token set, so `.dark` in `globals.css` keeps shadcn's canonical neutral dark values as a default.
- **`--sidebar` override** — the source bound `--sidebar` to `neutral-500`; it's overridden to match `--background`. Fix at the Figma source and re-export.
- **Name typos** — `backgrund`, `*-foregrund`, `Card` in the export are normalized to correct CSS-variable names on sync.

</details>

---

## 🏷️ White-label & per-brand theming

This repo is a **white-label base**. Each brand lives on its **own branch** and changes **one file** — everything else (components, scales, docs, agent rules) is inherited.

**The brand layer**

```
brand.config.json   ← edit this (colors + radius) — the only per-brand source
   │  npm run brand:build
   ▼
app/brand.css       ← AUTO-GENERATED :root / .dark (do not edit)
   │  @import
   ▼
app/globals.css     ← structural @theme (scales, shadows, mappings) — shared, stable
```

`brand:build` runs automatically before `dev` and `build`.

**Theme a new brand**

```bash
git checkout -b brand/acme
# edit brand.config.json — at minimum set light.primary (foreground auto-derives)
npm run dev          # regenerates app/brand.css and previews
```

Only `brand.config.json` (and `app/brand.css`) differ from the base, so pulling white-label updates (`git merge main`) rarely conflicts. A designer/agent can theme a brand by setting just `light.primary` — a readable `*-foreground` is derived by luminance.

> Fonts are swapped per brand in `app/layout.tsx` + `app/fonts/` (see [Fonts](#-fonts)).

**📖 Full guide:** [`WHITELABEL.md`](./WHITELABEL.md) — branch workflow, token reference, minimal/seed configs, sync, and a handoff checklist.

---

## 🤖 Figma → Code workflow

For AI-assisted implementation, this repo bundles a skill at
[`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md)
that auto-loads in Claude Code / Cursor / Copilot. Its contract:
**nothing added, nothing dropped, nothing inferred, nothing "polished."**

Just paste a Figma node URL and describe the task — no command to type:

```text
Implement this Figma frame as a React component:
https://www.figma.com/design/<fileKey>/<file>?node-id=123-456
```

<details>
<summary><b>The 6-step fidelity workflow</b></summary>

<br>

1. **`get_design_context`** — structured React + Tailwind for the node
2. **`get_screenshot`** — the visual source of truth
3. **`get_variable_defs`** — design tokens used, by Figma variable name
4. **Inventory** — a literal list of everything in the node, *before* any JSX
5. **Implement** — reuse shadcn components, map tokens 1:1
6. **Validate** — walk the inventory against the screenshot, item by item

Requires a **Figma Dev Mode MCP** connection and view/Dev access to the file.

</details>

---

## 📁 Project structure

```
.
├── app/
│   ├── globals.css              # All design tokens (:root · .dark · @theme inline)
│   ├── layout.tsx               # Root layout
│   ├── fonts/                   # Google Sans + Geist Mono (next/font/local)
│   └── (showcase)/              # Sidebar-wrapped showcase
│       ├── page.tsx             #   /                  → Foundations
│       ├── [tier]/page.tsx      #   /atoms             → tier overview grid
│       └── [tier]/[item]/page.tsx  # /atoms/button     → component + code
├── components/
│   ├── ui/                      # Full shadcn/ui library (56 components)
│   └── showcase/                # Demos (atoms/molecules/organisms) + sections + layout
├── tokens.json                  # ⭐ Figma DTCG export — the token source of truth
├── DESIGN.md                    # Design-system spec (single source of truth)
├── CLAUDE.md · AGENTS.md        # AI-agent instructions
└── components.json              # shadcn CLI config
```

---

## 🛠️ Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server → <http://localhost:3000> |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run brand:build` | Regenerate `app/brand.css` from `brand.config.json` (auto on dev/build) |
| `npm run tokens:import [path]` | Sync `brand.config.json` from a Figma `tokens.json` export |
| `npx shadcn@latest add <name>` | Add / update a component (`--overwrite` to refresh) |
| `npx shadcn@latest info --json` | Inspect project context |

---

## 🔤 Fonts

Fonts are **data-driven from the Figma `family/*` token**. This kit uses **Google Sans** (sans) — bundled as a local variable font in [`app/fonts/`](./app/fonts) and wired via `next/font/local` in `app/layout.tsx`, so it renders exactly like Figma out of the box. **Geist Mono** (mono) is declared but not bundled. For Thai projects, append a Thai sans (Noto Sans Thai / IBM Plex Sans Thai) to `--font-sans`.

## 🌗 Dark mode

Class-based: add `.dark` to `<html>` and semantic tokens auto-switch — **never** write `dark:` color overrides. `next-themes` is already a dependency; wire a `ThemeProvider` to add a toggle.

```tsx
// ✅                                  // ❌
<div className="bg-background          <div className="bg-white text-black
  text-foreground" />                    dark:bg-gray-950 dark:text-white" />
```

---

## 📚 Docs

| File | For | Contents |
| --- | --- | --- |
| [`WHITELABEL.md`](./WHITELABEL.md) | Brand teams + agents | White-label / per-brand theming guide |
| [`DESIGN.md`](./DESIGN.md) | Humans + agents | Full token reference + composition rules |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code | Project rules & hard constraints |
| [`AGENTS.md`](./AGENTS.md) | Cursor / Copilot | Universal agent config |
| [`SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md) | Any agent | Strict Figma-fidelity workflow |

**External:** [shadcn/ui](https://ui.shadcn.com/docs) · [Tailwind v4](https://tailwindcss.com/docs/theme) · [Figma Dev Mode MCP](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/)

<details>
<summary><b>FAQ</b></summary>

<br>

**Are components pre-installed?**
Yes — the full shadcn/ui library is in `components/ui/`. It's source you own; re-run `npx shadcn@latest add <name> --overwrite` to refresh any one.

**Why sync from Figma instead of `apply --preset`?**
A preset overwrites token values with shadcn defaults, breaking the 1:1 match with the source design.

**Tokens are raw hex, not OKLCH — intentional?**
Yes — the kit's exact sRGB output, so code is byte-identical to Figma.

**What's *not* included?**
Auth, routing helpers, Storybook/tests/CI, bundled fonts, `tailwind.config.ts` (Tailwind v4 uses `@theme inline`), and a license file. Add when the design calls for it.

</details>
