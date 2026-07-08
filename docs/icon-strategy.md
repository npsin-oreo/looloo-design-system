# Icon Strategy (DS v2)

> Audited 2026-07-08. Status: **IMPLEMENTED** — `icons/icon-registry.ts` (47
> curated icons) + `<Icon>` + `<IconButton>` exist; all 38 former direct
> lucide imports go through the registry (sole exception: the docs icon
> gallery); `npm run audit:icons` reports 0 HIGH and
> `.designops/icon-contract.json` is generated from the registry
> (`npm run icons:contract`). Part 1 below is preserved as the pre-migration
> audit record.

## Part 1 — Audit answers

### 1. What icon library is currently installed?

**Only `lucide-react`** (`^1.17.0`, installed 1.17.0), declared as a runtime
`dependency` — so package consumers receive it transitively. No other icon
package exists in `dependencies` or `devDependencies` (checked for heroicons,
radix-icons, phosphor, tabler, feather, react-icons, fontawesome, iconify).

### 2. Is lucide-react currently used?

Yes — it is the sole icon mechanism of the entire system, and
`components.json` declares `"iconLibrary": "lucide"`, so `npx shadcn add`
scaffolds new components with direct lucide imports too.

### 3. Which files import icons directly?

**39 `.tsx` files** import from `"lucide-react"`:

- **21 in `components/ui/`** (shipped in the npm package): accordion,
  breadcrumb, calendar, carousel, checkbox, combobox, command, context-menu,
  dialog, dropdown-menu, input-otp, menubar, native-select, navigation-menu,
  pagination, resizable, select, sheet, sidebar, sonner, spinner.
  Icons used are structural chrome: Chevron*, Check, X, Search, Minus,
  Loader2, MoreHorizontal, PanelLeft, GripVertical, and the status set in
  sonner (CircleCheck, Info, TriangleAlert, OctagonX).
- **5 in `components/docs/`** (docs site only): component-preview, demos,
  docs-sidebar, registry, and `references/icon-library.tsx` — which imports
  the **entire `icons` registry** from lucide to render the gallery
  (deliberate; server-rendered docs page, never bundled into stories).
- **13 in `stories/manual/`**: alert, badge, button-group, collapsible,
  combobox, data-table, date-picker, empty, input-group, item, sidebar,
  toggle, toggle-group.

### 4. Are there custom SVG icons?

**No.** Zero inline `<svg>` elements in `components/`, `app/`, or `stories/`,
and zero `.svg` asset files outside `storybook-static/` build output. There is
no `icons/` directory yet.

### 5. Are icons imported inconsistently?

The **source** is consistent (one library), but the **style** is not:

| Inconsistency | Evidence |
|---|---|
| Two naming conventions for the same icons | `components/ui/*` uses the `*Icon` suffix exports (`CheckIcon` ×7, `ChevronRightIcon` ×7, `XIcon`); `stories/*` mostly uses bare names (`Check`, `Search` ×5, `Bold`, `Star`) — both are valid lucide exports of the same components |
| No curation gate | any of lucide's ~1,500 icons can be imported anywhere; nothing defines the approved working set |
| Full-registry import | `icon-library.tsx` imports `{ icons }` (all of lucide) — fine for the docs page it serves, but a pattern that must never leak into `components/ui/*` |

Positive baseline: all 5 icon-only buttons (`size="icon"`) in stories carry
`aria-label` (5/5) — keep that bar.

### 6. Should we keep the current icon source? — **Yes.**

`lucide-react` stays the one and only default icon source: it is already in
all 39 call sites, standard in shadcn-based systems, outline-consistent,
tree-shakeable, and known to every AI agent. Adding another icon library is a
forbidden pattern (`.designops/forbidden-patterns.md`).

### 7. Should we add an icon wrapper? — **Yes.**

`<Icon name="search" size="md" tone="muted" />` gives one place to enforce
size/stroke/color tokens, and `<IconButton icon="search" aria-label="…" />`
makes the a11y requirement structural instead of reviewer-enforced.

### 8. Should we create an icon registry? — **Yes.**

`icons/icon-registry.ts` becomes the curation gate: the approved name →
component map, the `IconName` type that AI agents can autocomplete against,
and the generation source for `.designops/icon-contract.json`. It also ends
the `CheckIcon`-vs-`Check` naming split — registry names (`check`, `search`)
become the only spelling product code sees.

## Part 2 — Recommended direction (decided)

```txt
icons/
  icon-registry.ts     # curated name → lucide component map + IconName type
  icon-types.ts
  custom/              # product-specific SVG React components ONLY
    README.md
components/ui/icon/        → <Icon name="search" size="md" tone="muted" />
components/ui/icon-button/ → <IconButton icon="search" aria-label="Search" />
```

Rules once implemented:

1. **Common UI icons come from lucide-react through the registry** — product
   code imports `Icon`/`IconButton` or registry entries, never `lucide-react`
   directly, and never mixes icon packs.
2. **Product-specific SVGs live in `icons/custom/`** as React components,
   follow the same size/stroke model, and must be registered in
   `icon-registry.ts` — unregistered customs are forbidden.
3. Sizes/stroke/tone come from `tokens/component/icon.json`
   (`icon.size.xs–lg`, `icon.strokeWidth` — the legacy Figma export's
   `stroke-width/Mode 1` collection is the normalization source);
   `IconButton` sizes map to `{size.control.*}` and `aria-label` is a
   required prop.
4. Internal `components/ui/*` chrome (chevron in select, X in dialog) may keep
   direct lucide imports until the codemod pass — implementation detail, not
   product API.
5. Interim rule for new code (before the wrapper exists): import lucide named
   icons only inside `components/ui/*` internals; keep new direct imports in
   stories/product examples to a minimum so the codemod stays small.

## Part 3 — Migration plan (icon phase — NOT executed yet)

1. **Additive**: add `icons/icon-registry.ts` + `icon-types.ts` +
   `icons/custom/README.md`, `components/ui/icon/`,
   `components/ui/icon-button/`, and `tokens/component/{icon,icon-button}.json`.
   Registry seed = the icons actually used today (audit list in Part 1) — not
   all of lucide.
2. **Codemod** the 39 direct imports through the registry/wrapper
   (`lucide-react` remains a dependency — non-breaking; the `*Icon`/bare-name
   split disappears behind registry names).
3. **Audit**: `scripts/audit/icon-usage.mjs` — direct lucide imports outside
   the registry/ui-internals, inline `<svg>`, unregistered customs, icon-only
   buttons without `aria-label`. Report-first, then gate.
4. **Contract**: emit `.designops/icon-contract.json` from the registry
   (name, source, component, status, allowed usage).

Exception to codify in the audit's allowlist: `components/docs/references/`
(docs-site gallery) may import the full lucide `icons` registry.
