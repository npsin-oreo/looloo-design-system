<div align="center">

# Design → Dev Handoff

**A production-grade Next.js handoff repo: Figma design tokens (`tokens.json`) + the full shadcn/ui component library on Tailwind CSS v4 — tokens synced 1:1 from Figma, with strict pixel-fidelity enforced by an AI agent skill.**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-CLI--driven-000000)](https://ui.shadcn.com/)
[![Figma MCP](https://img.shields.io/badge/Figma-Dev_Mode_MCP-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/)

</div>

---

## Overview

This is **not** a component dump. It is a disciplined pipeline that turns a Figma design into production React code with no drift:

- **Tokens are synced 1:1 from Figma.** Every color, radius, font, and shadow in `app/globals.css` is the *exact* output of the Figma DTCG export [`tokens.json`](./tokens.json) (token set `shadcn-ui/Mode 1`, aliases resolved against `tw-colors`). Code renders byte-identical to the source.
- **The full component library is installed.** All shadcn/ui components live in `components/ui/` as source you own — ready for the dev team to use immediately, and re-addable/updatable via the CLI.
- **An agent skill enforces fidelity.** `.claude/skills/shadcn-ui-tailwind-figma/SKILL.md` auto-loads in Claude Code (and other Agent-Skill tools) and applies a strict contract: **nothing added, nothing dropped, nothing inferred, nothing "polished."**
- **The design system is documented.** [`DESIGN.md`](./DESIGN.md) is the single source of truth — a complete, official-grade token reference kept in lockstep with `globals.css` and the Figma kit.

> **Mental model:** Figma is the source of design intent *and* token values. Code mirrors it. This repo exists to hand that mirror to the dev team — automatic, documented, and tamper-evident.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [How to use](#how-to-use)
- [Project structure](#project-structure)
- [Design tokens](#design-tokens)
- [Figma → Code workflow](#figma--code-workflow)
- [Fonts](#fonts)
- [Theming](#theming)
- [Dark mode](#dark-mode)
- [AI agent configuration](#ai-agent-configuration)
- [Scripts](#scripts)
- [Git workflow](#git-workflow)
- [FAQ](#faq)
- [What this starter does NOT include](#what-this-starter-does-not-include)
- [References](#references)

## Features

- ⚡ **Next.js 15 App Router** + React 19 + TypeScript, zero-config
- 🎨 **Tailwind CSS v4** with `@theme inline` — no `tailwind.config.ts`
- 🔗 **Figma-synced design tokens** — 35 color tokens × light/dark, radius, type, shadow, all traceable to a named Figma variable
- 🤖 **Agent-enforced 1:1 fidelity** — inventory-first workflow, anti-drift rules
- 🧩 **shadcn/ui CLI-driven** — Radix/Base UI primitives, semantic tokens only
- 🌗 **Class-based dark mode** — tokens auto-switch, no `dark:` overrides
- 📐 **OKLCH-free, sRGB-exact** — values match the Figma kit to the byte
- 📚 **Fully documented** design system ([`DESIGN.md`](./DESIGN.md))

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 15 (App Router) · React 19 | RSC by default — add `"use client"` for interactivity |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS v4 | `@theme inline` in `globals.css`; no config file |
| Components | shadcn/ui (CLI-driven) | Radix **or** Base UI — check `npx shadcn@latest info` |
| Tokens | Figma-synced (sRGB) | `tokens.json` (DTCG export) → `shadcn-ui` token set |
| Fonts | Data-driven from Figma `family/*` | This kit: Inter (sans) · Geist Mono (mono) |
| Icons | lucide | Don't add other icon packs unless the design needs them |
| Design ↔ Code | Figma Dev Mode MCP | `get_design_context` / `get_screenshot` / `get_variable_defs` |

## Prerequisites

- **Node.js 18.18+** (20 LTS recommended) and npm / pnpm / bun
- A **Figma Dev Mode MCP** connection (Full or Dev seat) for the design-to-code workflow
- View/Dev access to the source Figma file you're implementing

## Quick start

```bash
# 1. Clone
git clone https://github.com/plugin87/shadcn-figma-starter-batch2.git
cd shadcn-figma-starter-batch2

# 2. Install dependencies
npm install            # or: pnpm install / bun install

# 3. Verify the shadcn project context (run this before any code change)
npx shadcn@latest info --json

# 4. Start the dev server
npm run dev
```

Open <http://localhost:3000> and replace `app/page.tsx` with your first screen.

> To render exactly like Figma, also install the fonts the kit declares — see [Fonts](#fonts).

## How to use

### Is there a plugin / skill / command to install?

| Thing | What it is | Do you install it? |
| --- | --- | --- |
| **`shadcn-ui-tailwind-figma` skill** | The fidelity workflow at `.claude/skills/.../SKILL.md` | **No** — it ships in this repo and **auto-loads** when the task involves shadcn, Tailwind, or Figma. You don't call it. |
| **Figma MCP server** | Bridges Figma ↔ your agent (`get_design_context`, `get_screenshot`, `get_variable_defs`) | **Yes, once** — connect Figma's Dev Mode MCP server (or the Figma connector in Claude). This is the only required external piece. |
| **shadcn CLI** | `npx shadcn@latest …` — adds components, reports project context | No install — run via `npx` on demand |
| **Slash command** | — | **None ship in this repo.** You drive it with a normal prompt + a Figma link. |

### The core loop

1. **Open the project** in an Agent-Skill tool (Claude Code, Cursor, Copilot, …).
2. **Connect a Figma MCP server** and make sure you have view/Dev access to the file.
3. **Give the agent a Figma node + an instruction.** Paste the Figma URL (or select the node in Figma) and ask in plain language. The skill auto-applies the 6-step workflow → installs any missing components via the shadcn CLI → validates against the screenshot.
4. **Review** the inventory and the result; answer any "stop and ask" questions.

### Example prompts

```text
Implement this Figma frame as a React component:
https://www.figma.com/design/<fileKey>/<file>?node-id=123-456

Build the login screen from the selected Figma node, 1:1, dark mode included.

Add the Button variants from this Figma page and wire them with shadcn.

Re-sync design tokens from the Figma kit and update globals.css + DESIGN.md.
```

You do **not** type a command or skill name — just describe the task and include the Figma reference. The agent will:

```bash
# what the skill makes the agent run, in order
npx shadcn@latest info --json          # project context (always first)
# → get_design_context / get_screenshot / get_variable_defs  (Figma MCP)
# → writes an inventory, then the JSX
npx shadcn@latest add <component>      # only what the design needs
npm run dev                            # verify visually
```

### Tips

- **Always let it run `npx shadcn@latest info --json` first** — wrong context = wrong imports.
- **Give the most specific node** (a component/frame, not a whole page) for accurate `get_variable_defs`.
- If Figma access fails, the agent runs `whoami` — share the file with that account.
- Want to change the look? Don't preset-swap — re-export the kit (see [Theming](#theming)).

## Project structure

```
.
├── .claude/
│   └── skills/shadcn-ui-tailwind-figma/SKILL.md   # Strict Figma-fidelity workflow (auto-loaded)
├── app/
│   ├── globals.css     # All design tokens — Figma-synced, :root + .dark + @theme inline
│   ├── layout.tsx      # Root layout
│   └── (showcase)/     # Sidebar-wrapped showcase, one route per tier
│       ├── layout.tsx          #   Shared sidebar shell
│       ├── page.tsx            #   /            → Foundations (color tokens)
│       ├── atoms/page.tsx      #   /atoms       → Atoms tier
│       ├── molecules/page.tsx  #   /molecules   → Molecules tier
│       └── organisms/page.tsx  #   /organisms   → Organisms tier
├── components/
│   ├── ui/             # Full shadcn/ui library (56 components, source you own)
│   └── showcase/       # Living preview: components grouped by Atomic Design
│       ├── atoms.tsx           #   Atoms (20) — buttons, inputs, badges, …
│       ├── molecules.tsx       #   Molecules (21) — cards, tabs, selects, …
│       ├── organisms.tsx       #   Organisms (14) — dialogs, table, chart, form, …
│       ├── sections.tsx        #   Tier + token renderers
│       └── showcase-layout.tsx #   Sidebar nav (route-aware) + page chrome
├── lib/
│   └── utils.ts        # cn() class-merge helper
├── public/             # Static assets
├── tokens.json         # Figma DTCG export — the token source of truth
├── AGENTS.md           # Universal AI-agent config (Cursor, Copilot, …)
├── CLAUDE.md           # Claude Code project instructions
├── DESIGN.md           # Design-system spec — single source of truth
├── components.json     # shadcn CLI config (aliases, base color, icon lib)
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Design tokens

Three-tier model (full detail in [`DESIGN.md`](./DESIGN.md)):

```
Tier 1  Primitives   raw Tailwind-palette sRGB (neutral/900, blue/9, …)
Tier 2  Semantic      --primary, --background, …   (:root / .dark)
Tier 3  Utilities     bg-primary, text-muted-foreground   (@theme inline)
```

Components only ever touch **Tier 3**. The same three tiers exist as Figma collections, so Tier 2 names match 1:1 across design and code — `get_variable_defs` returns `primary`, you write `bg-primary`, no translation.

| Category | Source | Summary |
| --- | --- | --- |
| Color | kit `shadcn/ui` collection | 31 standard + 4 kit-specific tokens, exact sRGB, light + dark |
| Radius | Tailwind v4 static scale | `rounded-xs…4xl` = 2/4/6/8/12/16/24/32px; `--radius` = `0.5rem` |
| Typography | Tailwind v4 + kit `family/*` | full size/weight/tracking/leading scale; Inter / Geist Mono |
| Spacing | Tailwind v4 (`--spacing` 0.25rem) | every `p-/m-/gap-/size-*` = `n × 4px` |
| Shadow | Tailwind v4 + kit override | `shadow-xs` = 10% (kit); rest = Tailwind default |
| Border | Tailwind v4 = kit | `0 / 1 / 2 / 4 / 8` px, color from `--border` |

> **Rule:** values are kit-synced and verified 1:1 against the Figma export. Never hand-edit a value or substitute a color — re-export from Figma and regenerate. See [`DESIGN.md` §2](./DESIGN.md).

## Figma → Code workflow

Enforced by [`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md). The **Fidelity Contract**: no adding, no removing, no inferring, no polishing.

1. **`get_design_context`** — structured React + Tailwind + Code Connect for the node
2. **`get_screenshot`** — the visual source of truth
3. **`get_variable_defs`** — the design tokens used (by Figma variable name)
4. **Inventory** — write a literal list of everything in the node *before* any JSX
5. **Implement** against the inventory — reuse shadcn components, map tokens 1:1
6. **Validate** against the screenshot — walk the inventory item by item

**Stop and ask** (don't guess) when: a variable resolves to a value not in the tokens; a referenced component isn't installed/known; screenshot and context disagree; a behavioral state isn't shown; sample data is placeholder; copy is in an unshipped language. The full list is in the skill.

## Fonts

Fonts are **data-driven from the Figma file's `family/*` token** — not a fixed project default. This kit resolves to:

| Variable | Stack | Figma token |
| --- | --- | --- |
| `--font-sans` | `"Inter", ui-sans-serif, system-ui, sans-serif` | `family/sans` = Inter |
| `--font-mono` | `"Geist Mono", ui-monospace, monospace` | `family/mono` = Geist Mono |

These are declared in `globals.css` but the font files are **not bundled**. To render exactly like Figma, install them — e.g. via `next/font`:

```tsx
// app/layout.tsx
import { Inter } from "next/font/google"
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
// add `${inter.variable}` to <html className>
```

…or through the shadcn font registry (see [`DESIGN.md` §4](./DESIGN.md)). For Thai projects, append a Thai sans (IBM Plex Sans Thai, Noto Sans Thai) to the `--font-sans` stack. **If your Figma file uses different fonts, regenerate `--font-*` from its token — don't hardcode.**

## Theming

Tokens live in `app/globals.css` only (`:root` light, `.dark` dark), synced **1:1 from the Figma kit** (exact sRGB).

- **Re-theme** — re-export the Figma `shadcn/ui` collection and regenerate `globals.css`. **Do not** run `npx shadcn@latest apply --preset`; it overwrites kit-synced values and causes drift (see `DESIGN.md` §2.5).
- **One token** — edit `globals.css`, then update the matching Figma variable in the same change.
- **New custom token** — define under `:root` + `.dark`, register in `@theme inline`, add the variable to Figma (both modes). Use sRGB hex, not OKLCH (see `DESIGN.md` §9).

> Never create a new CSS file — always edit `globals.css`.

## Dark mode

Class-based: add `.dark` to `<html>`. Semantic tokens auto-switch — **never** write `dark:` color overrides.

```tsx
// ✅ correct
<div className="bg-background text-foreground" />
// ❌ wrong
<div className="bg-white text-black dark:bg-gray-950 dark:text-white" />
```

To wire a toggle, add `next-themes` (not pre-installed):

```bash
npm install next-themes
```

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

## AI agent configuration

| File | Read by | Purpose |
| --- | --- | --- |
| `CLAUDE.md` | Claude Code | Project rules, hard constraints, must-read order |
| `AGENTS.md` | Cursor, Copilot, other agents | Universal equivalent of `CLAUDE.md` |
| `.claude/skills/.../SKILL.md` | Any Agent-Skill tool | The strict Figma-fidelity workflow (auto-loaded on relevant tasks) |
| `DESIGN.md` | Humans + agents | Token reference + composition rules |

The skill triggers automatically when working with shadcn components, Tailwind classes, or Figma nodes — its full instructions load into context only when needed.

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | Start the dev server (<http://localhost:3000>) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint (`next lint`) |
| `npx shadcn@latest info --json` | Inspect project context — **run before any code change** |
| `npx shadcn@latest search <q>` | Search the registry before building custom UI |
| `npx shadcn@latest add <name>` | Add a component (`--dry-run` / `--diff` to preview) |

## Git workflow

```
main   ← stable, mirrors what's shipped
  ▲ fast-forward / PR
dev    ← active work; commit here, then merge to main
```

Work on `dev`, commit, push, then merge into `main` in rounds:

```bash
git checkout dev
# …changes…
git commit -m "…" && git push origin dev
git checkout main && git merge dev && git push origin main
```

## FAQ

**Will every developer/student produce the same result?**
The *visual output* converges tightly: tokens are fixed and kit-synced, and the skill forbids adding/removing/inferring/polishing — so colors, spacing, radius, and type are identical. The *code structure* (JSX shape, class order, which components are installed) will vary, because LLM codegen isn't deterministic. Grade/measure on **fidelity to Figma + rule adherence**, not byte-identical code.

**Are components pre-installed?**
Yes — the full shadcn/ui library is in `components/ui/` so the dev team can start immediately. They're source you own; re-run `npx shadcn@latest add <name> --overwrite` any time to pull the latest version of one.

**Why sync from Figma instead of `apply --preset`?**
A preset overwrites token values with shadcn defaults, breaking the 1:1 match with the source design. The kit is the source of truth.

**Tokens look like raw hex, not OKLCH — is that intentional?**
Yes. Values are the kit's exact sRGB output so code is byte-identical to Figma. Convert to OKLCH only at high precision if you must.

## What this starter does NOT include

Add when the design calls for it, not before:

- No authentication, routing helpers, or middleware
- No Storybook, testing setup, or CI config
- No theme toggle pre-installed (add `next-themes` when needed)
- No bundled font files — declared per the Figma token; install to match (see [Fonts](#fonts))
- No `tailwind.config.ts` — Tailwind v4 uses `@theme inline` in `globals.css` only
- No license file — add one before distributing

## References

- [`DESIGN.md`](./DESIGN.md) — design-system spec (token source of truth)
- [`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md) — fidelity workflow
- shadcn/ui — [Theming](https://ui.shadcn.com/docs/theming) · [Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) · [Figma](https://ui.shadcn.com/docs/figma)
- [Tailwind CSS v4 — Theme](https://tailwindcss.com/docs/theme)
- [Figma Dev Mode MCP server](https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/)
