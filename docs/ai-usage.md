# AI Usage (DS v2)

How AI agents (Claude Code, Cursor, Copilot) should work in this repo.

## Read order

1. `CLAUDE.md` — session rules (auto-loaded by Claude Code; hard rules like
   "semantic tokens only", "CLI for components", "when in doubt, ask")
2. `.designops/ai-import-rules.md` — import/token/component rules
3. `.designops/forbidden-patterns.md` — what never to generate
4. `docs/tokens/token-source-strategy.md` — which token layer to touch, when
5. `docs/component-guidelines.md` / `docs/icon-strategy.md` / `docs/theming.md`

## Task → entry point

| Task | Start at |
|---|---|
| Build/modify UI | `@/components/ui/*` + semantic Tailwind tokens; skill `.claude/skills/shadcn-ui-tailwind-figma/` triggers for Figma work |
| Change brand colors/radius | `brand.config.json` (neutral) or `brands/<name>.config.json` → `npm run tokens:theme && npm run tokens:build` (never edit `dist/tokens/*.css`) |
| Add/adjust a component decision (height, padding…) | `tokens/component/<name>.json` (hand-owned) |
| New semantic role | `tokens/semantic/*.json` (hand-owned) |
| New Figma export | `npm run tokens:import` (into `tokens/`; the primitive/semantic tiers are hand-authored) |
| Anything under `tokens/raw/` | migration tasks only |

## Verification an agent must run before claiming done

```bash
npm run tokens:validate   # after any token edit
npm run audit:styles      # after component styling changes (report-only)
npx tsc --noEmit          # after any TS change
npm run test-storybook    # after component/story changes (CI parity)
```

## Known debt an agent must NOT "helpfully fix" out of scope

- 39 direct `lucide-react` imports → dedicated icon phase (codemod)
- `bg-white` in `components/ui/slider.tsx` → component-tokenization phase
- flat `components/ui/*.tsx` layout → dedicated restructure phase (published
  npm subpaths depend on it)
