# .designops/

Machine- and AI-readable contracts that keep humans, CI, and AI agents from
inventing inconsistent UI.

All contracts are **generated** and drift-checked in CI — never hand-edit.

| File | Status | Regenerate |
|---|---|---|
| `forbidden-patterns.md` | ✅ hand-owned policy (enforcement legend inside) |
| `ai-import-rules.md` | ✅ hand-owned policy |
| `audit-gates.md` | ✅ hand-owned policy — which audits block CI vs report |
| `token-contract.json` | ✅ 616-token v2 contract (the **root** `token-contract.json` stays the published legacy brand-config contract) | `npm run tokens:build` |
| `icon-contract.json` | ✅ 47 icons from the registry | `npm run icons:contract` |
| `component-contract.json` | ✅ 58 components — import paths, cva variants/sizes, token paths, story/a11y coverage | `npm run contracts:build` |
| `theme-contract.json` | ✅ 4 themes + 5 modes with selectors/status/override paths | `npm run contracts:build` |
