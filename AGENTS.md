# AI Agent Instructions

This file is the entry point for any AI agent working in this repository (Claude Code, Cursor, Codex, GitHub Copilot, Windsurf). It tells the agent where the rules live.

## Read in this order

1. **[`DESIGN.md`](./DESIGN.md)** — design system spec (tokens, naming, composition rules)
2. **[`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md)** — the strict Figma-to-code workflow

## Stack

- **Framework:** Next.js 15 (App Router) · TypeScript · React 19
- **Styling:** Tailwind CSS v4 (OKLCH tokens, `@theme inline`)
- **UI library:** shadcn/ui (CLI-driven, components live in this repo)
- **Design source:** Figma (via Dev Mode MCP server)
- **Package manager:** check `packageManager` in `package.json` or run `npx shadcn@latest info --json`

## Project context

Before any code change, run:

```bash
npx shadcn@latest info --json
```

This tells you the framework, style, base library (Radix or Base UI), RSC setting, Tailwind version, CSS file path, icon library, and installed components.

## Non-negotiable rules

- **Figma fidelity.** Build exactly what the Figma node shows — no added states, no inferred missing parts, no "polish". Full inventory-first workflow in the skill file.
- **Semantic tokens only.** Use `bg-primary`, `text-muted-foreground`, etc. Never raw colors like `bg-blue-500` or `text-emerald-600`.
- **`gap-*` not `space-x-*` / `space-y-*`.**
- **`size-*` for equal dimensions.** `size-10` not `w-10 h-10`.
- **`cn()` for conditional classes.** Import from `@/lib/utils`.
- **Edit `app/globals.css`** for token changes. Never create a new CSS file.
- **CLI for components.** Use `npx shadcn@latest add <name>` — don't hand-write `components/ui/*` files.
- **When unsure, ask.** Don't guess defaults. Don't use sensible fallbacks. The skill file lists every situation that requires asking.

## Commands

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run lint         # ESLint

npx shadcn@latest info --json           # Project context (run first)
npx shadcn@latest search <query>        # Find components
npx shadcn@latest add <component>       # Install a component
npx shadcn@latest add <component> --dry-run --diff   # Preview update
```
