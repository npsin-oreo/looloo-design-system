# Claude Code Instructions

This file is loaded into Claude Code's system prompt on every session.

## Read first

1. **[`DESIGN.md`](./DESIGN.md)** — design system spec
2. **[`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md)** — auto-discovered skill for shadcn + Tailwind + Figma work

The skill triggers automatically when working with shadcn components, Tailwind classes, or Figma nodes — its full instructions only load into context when needed.

## Stack

Next.js 15 (App Router) · TypeScript · React 19 · Tailwind CSS v4 · shadcn/ui · Figma Dev Mode MCP.

## Project context

Run before any code change:

```bash
npx shadcn@latest info --json
```

## Token source

This is a **white-label base**; brands live on their own branch. Brand colors + radius live ONLY in [`brand.config.json`](./brand.config.json) → generated into `app/brand.css` by `npm run brand:build` (auto-runs on dev/build). **To change a brand's colors, edit `brand.config.json` — never hand-edit `app/brand.css` or the `:root`/`.dark` values.** `app/globals.css` holds only structural `@theme` (scales, shadows, var mappings) shared across brands.

The default brand values trace to [`tokens.json`](./tokens.json) (Figma DTCG export, `shadcn-ui/Mode 1`). Light mode only — `.dark` holds shadcn defaults. The **full** shadcn/ui library is in `components/ui/`. `react-day-picker` is pinned to v9 (the version `calendar.tsx` targets).

## Hard rules

- **No invented Figma details.** If the design doesn't show it, don't add it. If the design shows it, don't drop it.
- **Semantic tokens only** — `bg-primary`, `text-muted-foreground`, never raw colors.
- **`gap-*` not `space-y-*`. `size-10` not `w-10 h-10`.**
- **Use `cn()`** from `@/lib/utils` for conditional classes.
- **Edit `app/globals.css`** for tokens — never create new CSS files.
- **CLI for components:** `npx shadcn@latest add <name>` — don't hand-write `components/ui/*`.
- **When in doubt, ask.** See the "When to stop and ask" section in the skill.

## Useful commands

```bash
npm run dev
npm run build
npm run lint

npx shadcn@latest info --json
npx shadcn@latest search <query>
npx shadcn@latest add <component>
npx shadcn@latest add <component> --dry-run --diff
```
