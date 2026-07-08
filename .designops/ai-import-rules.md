# AI Import & Token Rules

Rules for AI agents (Claude, Cursor, Copilot) generating or modifying code in
this repo. Human PRs follow the same rules.

## Imports

```tsx
// ✅ components — flat paths (current public contract)
import { Button } from "@/components/ui/button"
// ✅ utils
import { cn } from "@/lib/utils"
// ✅ consumers of the published package
import { Button } from "@npsin-oreo/design-system/button"

// ❌ never deep-import internals or raw tokens
import x from "@/tokens/raw/legacy.tokens.json"
// ❌ never add a second icon library
import { X } from "@heroicons/react"
```

## Styling

1. Semantic Tailwind tokens only: `bg-primary`, `text-muted-foreground` —
   never `bg-white`, `text-black`, raw palette steps, or literal colors.
2. `gap-*` not `space-y-*`; `size-10` not `w-10 h-10`; `cn()` for conditional
   classes (see `CLAUDE.md`).
3. No invented Figma details — if the design doesn't show it, don't add it.

## Tokens (canonical layer = `tokens/`)

1. Creating/altering a component? Check `tokens/component/<component>.json`
   first; add missing decisions there (hand-owned file), not as magic numbers.
2. Colors go through semantic tokens (`tokens/semantic/*`); reach primitives
   only via an alias chain, never directly from component code.
3. `tokens/raw/*` is off-limits unless the task IS token migration.
4. The generated subset of `tokens/` (table in `tokens/README.md`) is never
   edited by hand — change the source (`brand.config.json` / `tokens.json`)
   and run `npm run tokens:migrate`.
5. New aspirational tokens carry `$extensions["looloo.status"] = "proposed"`.
6. After any token edit: `npm run tokens:validate` must pass.

## Components

1. New shadcn components come via `npx shadcn@latest add <name>` — do not
   hand-write `components/ui/*`.
2. Every new variant/size needs: token mapping + Storybook story (CI runs
   render + axe on all stories).
3. Do not move/rename `components/ui/*.tsx` — each file is a published npm
   subpath. Structural moves happen only in the dedicated restructure phase
   with compatibility re-exports.

## When in doubt

Stop and ask. See `CLAUDE.md` → "When to stop and ask", and
`docs/tokens/token-source-strategy.md` for where each kind of change belongs.
