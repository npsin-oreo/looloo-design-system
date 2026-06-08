---
name: shadcn-ui-tailwind-figma
description: Build and modify UI with shadcn/ui + Tailwind CSS v4, translating Figma designs into production code with strict 1:1 fidelity via the Figma Dev Mode MCP server. Use this skill whenever the user mentions shadcn, components.json, a Figma file or frame, design tokens, theming, dark mode, or asks to add/install/wire up any UI component. Especially use it when translating a Figma node to React — the skill enforces a strict inventory-first workflow so the implementation matches Figma exactly with no inferred extras, no inferred missing parts.
---

# shadcn/ui + Tailwind v4 + Figma — strict 1:1 fidelity

This skill has one job: build UI from Figma that matches Figma exactly. No extras, no shortcuts, no "polish" the design didn't ask for.

The four pillars:
1. **Project context** — read the project before writing code.
2. **Strict Figma fidelity** — inventory the node, build the inventory, validate against the screenshot.
3. **Critical Rules** — non-negotiable shadcn patterns for styling, composition, forms, icons.
4. **CLI workflow** — install components via `shadcn` CLI; never copy-paste from elsewhere.

Read `DESIGN.md` at the project root before any change. It defines the tokens and project-specific overrides. When `DESIGN.md` and the official shadcn defaults disagree, `DESIGN.md` wins.

---

## 0. The Fidelity Contract

Before reading anything else, internalize these rules. They override every "best practice" instinct.

**No adding.**
If Figma doesn't show a hover state, you don't add one. If Figma doesn't show a focus ring, you don't add one. If Figma doesn't show a placeholder, you don't add one. If Figma doesn't show a loading state, you don't add one. If Figma doesn't show an icon, you don't add one — even if the label "obviously" needs one.

**No removing.**
If Figma shows a 1px hairline divider, it goes in. If Figma shows 13px text, it goes in (not 14). If Figma shows asymmetric padding (16 top, 12 bottom), it goes in — don't round to 16/16. If Figma shows a label that says "เพิ่มข้อมูล" don't translate it to "Add data".

**No inferring.**
If you can't tell from the design context + screenshot whether a value should be A or B — **stop and ask**. Don't guess. Don't use sensible defaults. Don't "do what other projects do". Examples that always need asking:
- Behavior of a button when the form is invalid (Figma rarely shows disabled state)
- What happens on click of a "View all" link
- Empty state for a list
- Loading state
- Whether a card is clickable as a whole or only its CTA
- Real values for sample data

**No polishing.**
Designers chose those exact paddings, those exact corners, that exact font weight. The job is to honor the choice, not "improve" it. If the design looks wrong to you, raise it — don't silently fix it.

---

## 1. Read project context first

Before any command or code change:

```bash
npx shadcn@latest info --json
```

Use these fields:

| Field | Why it matters |
| --- | --- |
| `packageManager` | Use the right runner: `npx`, `pnpm dlx`, or `bunx --bun` |
| `framework` | next, vite, laravel, react-router, astro, tanstack-start |
| `style` | Visual treatment (base, new-york, nova, …) |
| `base` | `radix` or `base` — affects API (`asChild` vs `render`) |
| `isRSC` | When `true`, components with `useState`, `useEffect`, event handlers, or browser APIs need `"use client"` at the top |
| `tailwindVersion` | `v4` uses `@theme inline`; `v3` uses `tailwind.config.js` |
| `tailwindCssFile` | Path to global CSS — **edit this file, never create a new one** |
| `iconLibrary` | `lucide`, `tabler`, etc. — imports must match |
| `aliases` | Where `components`, `lib`, `hooks`, `ui` live |
| `components[]` | Already installed — don't re-add |

Substitute the project's `packageManager` for every `npx shadcn@latest` example below.

---

## 2. Figma → Code workflow (the strict path)

Six steps. Don't skip. Don't reorder.

### Step 1 — Fetch design context

```
get_design_context(<node-id>)
```

This returns the structured React + Tailwind representation, plus any Code Connect mappings and annotations.

If the response is **too large or truncated**:
1. Run `get_metadata(<root-node-id>)` to get the high-level node map.
2. Re-fetch only the required leaf node(s) with `get_design_context`.

### Step 2 — Fetch the screenshot

```
get_screenshot(<node-id>)
```

The screenshot is the source of truth for **visual fidelity**. The design context is the source of truth for **structure and tokens**. You need both before writing code.

### Step 3 — Fetch the variables

```
get_variable_defs(<node-id>)
```

This returns the design tokens used (colors, spacing, typography, radius) by Figma variable name. If you get raw hex/numeric values instead, prompt explicitly: "Get the variable names and values used in this frame."

### Step 4 — Build the inventory (mandatory)

**Before writing any JSX**, write the inventory of what's in the node. This is a literal list of everything visible plus everything structural. Write it as a comment block at the top of the file, or in your reply to the user. Example for a card:

```
INVENTORY of figma node "card/product"
- Container: rounded-lg, padding 24, gap 16, bg=card, border=border
- Image: 240×160, rounded-md, object-cover
- Title: text-lg, font-medium, color=card-foreground
- Description: text-sm, color=muted-foreground, 2 lines max
- Footer row: gap-2, justify-between
  - Price: text-base, font-medium
  - Button: variant=outline, size=sm, label "View"
- States visible: default only (no hover, no focus, no disabled shown in Figma)
- Variables used: --card, --card-foreground, --muted-foreground, --border, --radius
```

If a property isn't in Figma → it's not in the inventory → it doesn't get coded.

### Step 5 — Implement against the inventory

Translate each inventory line into JSX one-by-one. Map design tokens to project tokens:

| Figma reports | Use in code |
| --- | --- |
| `--background` variable, or color matching | `bg-background` |
| `--primary` variable | `bg-primary` |
| Spacing token `space/4` (16px) | `p-4`, `gap-4` |
| Radius token `radius/lg` | `rounded-lg` |
| A red rectangle with no variable attached | **STOP** — ask the designer to attach a variable, or confirm with the user which token applies |

**Reuse existing components.** A button-shaped thing becomes `<Button>`, not a styled `<div>` or raw `<button>`. Check the inventory of installed components via `info --json` first. If a needed component is missing, install it via `npx shadcn@latest add <name>` before writing the JSX.

**If the Figma MCP returns a localhost source for an image or SVG asset**, use that source directly. Do NOT create placeholders. Do NOT import new icon packages — use what's already installed.

### Step 6 — Validate against the screenshot

Compare the rendered output to the Figma screenshot side-by-side. Walk down the inventory and check each item.

If anything diverges:
- Wrong token → fix the className
- Wrong spacing → check the Figma value again, then fix
- Missing element from the inventory → add it
- Extra element not in the inventory → remove it
- Looks "off" but matches the inventory → that's correct. Stop second-guessing.

Only mark complete after this pass.

---

## 3. shadcn CLI workflow

### Search before building

```bash
npx shadcn@latest search <query>
```

Check the official registry and community registries (`@magicui`, `@tailark`, `@bundui`, …) before writing custom UI.

### Add

```bash
# One or more
npx shadcn@latest add button card dialog

# From a community registry
npx shadcn@latest add @magicui/shimmer-button

# Preview before applying
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff button.tsx
```

### Verify after install

After adding any component or block:
1. Read the added files — confirm paths match the project's aliases.
2. For **third-party registries**, check non-UI files for hardcoded import paths like `@/components/ui/...`. These often don't match the project's actual `ui` alias. Run `npx shadcn@latest info` and rewrite imports.
3. Check for missing sub-components (e.g. `SelectItem` without `SelectGroup`), missing imports, or rule violations.

### Update safely

```bash
npx shadcn@latest add button --diff        # see the diff
npx shadcn@latest add button --dry-run     # see all affected files
```

Always preview before overwriting components you've modified.

---

## 4. Critical Rules — always enforced

From the official `shadcn-ui/ui` skill. Apply to every line of code.

### 4.1 Styling

| Rule | Correct | Wrong |
| --- | --- | --- |
| Semantic tokens only | `bg-primary text-primary-foreground` | `bg-blue-500 text-white` |
| `gap-*` for spacing | `flex flex-col gap-4` | `space-y-4` |
| `size-*` for equal dimensions | `size-10` | `w-10 h-10` |
| `truncate` shorthand | `truncate` | `overflow-hidden text-ellipsis whitespace-nowrap` |
| No manual dark overrides | `bg-background` | `bg-white dark:bg-gray-950` |
| `className` for layout only | `<Card className="max-w-md mx-auto">` | `<Card className="bg-blue-100">` |
| Status colors via Badge or tokens | `<Badge variant="secondary">+20.1%</Badge>` | `<span className="text-emerald-600">` |

### 4.2 Conditional classes — use `cn()`

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "flex items-center",
  isActive ? "bg-primary text-primary-foreground" : "bg-muted"
)} />
```

Never write manual ternaries inside `className` template strings.

### 4.3 Forms

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
    <FieldDescription>We'll never share your email.</FieldDescription>
  </Field>
</FieldGroup>
```

- Validation: `data-invalid` on **Field**, `aria-invalid` on the **control**
- Disabled: `data-disabled` on Field, `disabled` on the control
- `InputGroup` uses `InputGroupInput` / `InputGroupTextarea` — never raw `Input` / `Textarea` inside `InputGroup`
- Option sets (2–7 choices) use `ToggleGroup`, not a loop of `Button`
- `FieldSet` + `FieldLegend` for grouping checkboxes/radios

### 4.4 Composition

- **Items inside their Group.** `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- **Custom triggers:** `asChild` for Radix, `render` for Base UI. Check the `base` field via `npx shadcn@latest info`.
- **Overlay accessibility:** Dialog, Sheet, Drawer always need a Title (use `VisuallyHidden` if it shouldn't render).
- **No manual `z-index`** on overlays.

### 4.5 Icons

```tsx
// Inside a Button — use data-icon, no sizing
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// Outside a Button — use size-*
<SearchIcon className="size-4" />
```

Import from the project's `iconLibrary` (check `info --json`). Don't import new icon packages unless the user adds one explicitly.

### 4.6 Built-in variants first

Customization priority:
1. Built-in variants (`variant="outline"`, `size="sm"`)
2. `className` for layout
3. New variant via `cva` in the component source
4. Wrapper component

---

## 5. Theming and tokens

Tokens live in the file at `tailwindCssFile` (usually `app/globals.css`). **Never create a new CSS file.**

### Add a custom token

Use the kit's sRGB hex format (not OKLCH) so new tokens match the existing convention, and add the matching variable to the Figma `shadcn/ui` collection (both modes) in the same change.

```css
/* 1. Define */
:root {
  --warning: #f59e0b;
  --warning-foreground: #451a03;
}
.dark {
  --warning: #b45309;
  --warning-foreground: #fffbeb;
}

/* 2a. Tailwind v4 */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

For Tailwind v3, register in `tailwind.config.js` with `var(--warning)`.

### Re-theme (do NOT preset-swap)

Token values are synced **1:1 from the Figma kit** (exact sRGB). **Never run
`npx shadcn@latest apply --preset`** — it overwrites the kit-synced values and
makes generated code drift from Figma. To re-theme: re-export the Figma
`shadcn/ui` collection and regenerate `globals.css`. See `DESIGN.md` §2.5.

### Radius

The kit uses the **Tailwind v4 static radius scale** — *not* shadcn's
`calc(var(--radius) * n)`. `rounded-sm` = 4px, `rounded-md` = 6px
(`--radius-md`), `rounded-lg` = 8px (`--radius-lg`), `rounded-xl` = 12px,
`rounded-2xl` = 16px, `rounded-3xl` = 24px, `rounded-4xl` = 32px. `--radius`
is `0.5rem` (8px = `rounded-lg`, the kit default). When `get_variable_defs`
reports a radius, map it to the exact step above — don't recompute. See
`DESIGN.md` §3.

---

## 6. Variable alignment (Figma ↔ Code)

The names in Figma Variables must match the CSS variable names in `globals.css`:

| Figma Variable | CSS Variable |
| --- | --- |
| `background` | `--background` |
| `primary` | `--primary` |
| `primary-foreground` | `--primary-foreground` |
| `muted-foreground` | `--muted-foreground` |
| `rounded-lg` | `--radius-lg` (8px, static scale) |

When `get_variable_defs` returns `primary`, you write `bg-primary` — no translation, no guesswork. The token's **value** is whatever `globals.css` holds (kit-synced sRGB); never substitute a different color, lighten/darken, or "improve" it — that is drift.

Use the kit's semantic collection modes (`light mode` / `dark mode`) so each variable has both values, matching `:root` and `.dark` in `globals.css`. Values are exact kit sRGB — never hand-edit; re-export from Figma. Kit-specific tokens (`background-color`, `semantic-background/-foreground/-border`) exist too — use them as-is, don't drop or invent.

---

## 7. Quick reference

```tsx
// Form
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>

// Validation
<Field data-invalid>
  <FieldLabel>Email</FieldLabel>
  <Input aria-invalid />
  <FieldDescription>Invalid email.</FieldDescription>
</Field>

// Icon in button
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// Spacing
<div className="flex flex-col gap-4">…</div>

// Equal dimensions
<Avatar className="size-10">…</Avatar>

// Status colors
<Badge variant="secondary">+20.1%</Badge>

// Conditional classes
<div className={cn("flex items-center", isActive && "bg-primary text-primary-foreground")} />
```

---

## 8. When to stop and ask

These situations always require asking the user before continuing, not guessing:

- A variable in Figma resolves to a value that isn't in the project's tokens
- A Figma node references a component that isn't installed and isn't in any known registry
- The screenshot and design context disagree (different padding, different color, different layout)
- A behavioral state (hover, focus, disabled, loading, error) is mentioned in the design context but isn't shown in any frame
- Sample data in Figma is obviously placeholder ("Lorem ipsum", "John Doe") and the user hasn't provided real content
- A copy string is in a language the project doesn't ship — confirm if it should be translated, kept, or replaced with a key
- The Figma file uses a component pattern that conflicts with shadcn's Critical Rules

Asking takes thirty seconds. Guessing wrong takes an hour to fix.

---

## 9. References

- shadcn/ui official skill: <https://github.com/shadcn-ui/ui/tree/main/skills/shadcn>
- shadcn/ui theming docs: <https://ui.shadcn.com/docs/theming>
- shadcn/ui Tailwind v4 docs: <https://ui.shadcn.com/docs/tailwind-v4>
- shadcn/ui Figma kits: <https://ui.shadcn.com/docs/figma>
- Figma Dev Mode MCP server: <https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/>
- Figma MCP server guide: <https://github.com/figma/mcp-server-guide>
