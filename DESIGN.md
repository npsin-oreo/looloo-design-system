# Design System

Single source of truth for tokens, naming, and composition rules.
All component code, Figma components, and AI-generated UI must follow this document.

Stack: **shadcn/ui** (Radix or Base UI primitives) · **Tailwind CSS v4** · **Tailwind color palette (sRGB), Figma-synced** · **Figma Dev Mode MCP**

> Precedence: **the Figma export wins.** Tokens here mirror the DTCG export
> [`tokens.json`](./tokens.json) (token set `shadcn-ui/Mode 1`, aliases resolved
> against `tw-colors/Mode 1`) 1:1. Where the export and stock shadcn defaults
> disagree, the export wins and this document tracks it. Where this document and
> shadcn defaults disagree, this document wins.
>
> **Light mode only:** the export ships no dark token set. `.dark` in
> `globals.css` keeps shadcn's canonical neutral dark values as a default —
> replace once a dark set is exported.

---

## 1. Token Architecture

Three-tier model, matching the official shadcn/ui structure:

```
Tier 1 — Primitive tokens
  Raw Tailwind-palette sRGB values. Never used directly in components.
  Example: #171717 (neutral/900), #0090ff (blue/9)

Tier 2 — Semantic tokens (CSS variables)
  Defined in :root and .dark in globals.css.
  Example: --primary, --background, --muted-foreground

Tier 3 — Tailwind utilities
  Mapped via @theme inline in globals.css.
  Example: bg-primary, text-muted-foreground
```

Components reference Tier 3 utilities only. Changing a Tier 2 variable re-themes every component. In Figma the same three tiers exist as collections (`tw/colors` → `shadcn/ui` → component), so Tier 2 names match 1:1 across code and design.

---

## 2. Color System

### 2.1 Naming convention

We use semantic background and foreground pairs. The base token controls the surface color and the `-foreground` token controls the text and icon color that sits on that surface. The background suffix is omitted for the surface token — for example, `primary` pairs with `primary-foreground`.

- The **base** variable (`--primary`) is the surface color
- The **`-foreground`** variable (`--primary-foreground`) is the text / icon color on that surface

### 2.2 Source of truth

The complete scaffold lives in [`app/globals.css`](./app/globals.css). Values are the **exact sRGB output of the Figma kit** (`shadcn/ui` collection, `light mode` → `:root`, `dark mode` → `.dark`), so code renders byte-identical to the original Figma. Do not hand-edit values — re-export from Figma and regenerate.

**Deviations from stock shadcn (the kit's choices, intentionally kept):**

| Area | Stock shadcn neutral | This kit |
| --- | --- | --- |
| Color format | OKLCH | sRGB hex (Tailwind palette aliases) |
| `--radius` | `0.625rem` (10px) + `calc()` scale | `0.5rem` (8px) + Tailwind v4 **static** scale |
| `--secondary-foreground` (light) | `oklch(0.205 0 0)` ≈ `#262626` | `#0a0a0a` (= `foreground`) |
| `--chart-1…5` | multi-hue | single **blue ramp** (`#5eb1ef → #113264`) |
| `--destructive` (dark) | desaturated red | `#f87171` (red-400) |
| Fonts | unset (Tailwind default) | `--font-sans` Google Sans · `--font-mono` Geist Mono (bundled via `next/font/local`) |
| Extras | — | `--background-color`, `--semantic-background/-foreground/-border` |

### 2.3 Token reference

This table is **1:1 with [`app/globals.css`](./app/globals.css)** and with the Figma `shadcn/ui` collection — every variable is listed with its exact light/dark value. If you add or remove a token in `globals.css`, update this table in the same change.

**Core surface & text**

| Variable | Utility | Light | Dark | Purpose |
| --- | --- | --- | --- | --- |
| `--background` / `--foreground` | `bg-background` / `text-foreground` | `#ffffff` / `#0a0a0a` | `#0a0a0a` / `#fafafa` | Page surface and default text (also on `body`) |
| `--card` / `--card-foreground` | `bg-card` / `text-card-foreground` | `#ffffff` / `#0a0a0a` | `#171717` / `#fafafa` | Card surfaces |
| `--popover` / `--popover-foreground` | `bg-popover` / `text-popover-foreground` | `#ffffff` / `#0a0a0a` | `#262626` / `#fafafa` | Floating panels (popover, dropdown, command) |

**Brand & intent**

| Variable | Utility | Light | Dark | Purpose |
| --- | --- | --- | --- | --- |
| `--primary` / `--primary-foreground` | `bg-primary` / `text-primary-foreground` | `#171717` / `#fafafa` | `#e5e5e5` / `#171717` | Primary actions — light = `neutral/900` on `neutral/50` |
| `--secondary` / `--secondary-foreground` | `bg-secondary` / `text-secondary-foreground` | `#f5f5f5` / `#0a0a0a` | `#262626` / `#fafafa` | Secondary actions |
| `--muted` / `--muted-foreground` | `bg-muted` / `text-muted-foreground` | `#f5f5f5` / `#737373` | `#262626` / `#a3a3a3` | Muted surfaces and helper text |
| `--accent` / `--accent-foreground` | `bg-accent` / `text-accent-foreground` | `#f5f5f5` / `#171717` | `#404040` / `#fafafa` | Hover and accent states |
| `--destructive` | `bg-destructive` / `text-destructive` / `border-destructive` | `#dc2626` | `#f87171` | Errors and destructive actions — **single token, no `-foreground` pair** (see note) |

**Forms & focus**

| Variable | Utility | Light | Dark | Purpose |
| --- | --- | --- | --- | --- |
| `--border` | `border-border` | `#e5e5e5` | `#404040` | Default border (applied to `*` in `@layer base`) |
| `--input` | `border-input` · `bg-input/30` (dark) | `#e5e5e5` | `#171717` | Form control borders / fills |
| `--ring` | `ring-ring` · `outline-ring/50` | `#737373` | `#737373` | Focus ring and base outline |

**Charts** (kit uses a single blue ramp, identical in both modes)

| Variable | Utility | Light / Dark | Purpose |
| --- | --- | --- | --- |
| `--chart-1` | `bg-chart-1` / `stroke-chart-1` | `#5eb1ef` | Data series 1 |
| `--chart-2` | `bg-chart-2` / `stroke-chart-2` | `#0090ff` | Data series 2 |
| `--chart-3` | `bg-chart-3` / `stroke-chart-3` | `#0588f0` | Data series 3 |
| `--chart-4` | `bg-chart-4` / `stroke-chart-4` | `#0d74ce` | Data series 4 |
| `--chart-5` | `bg-chart-5` / `stroke-chart-5` | `#113264` | Data series 5 |

**Sidebar palette**

| Variable | Utility | Light | Dark | Purpose |
| --- | --- | --- | --- | --- |
| `--sidebar` / `--sidebar-foreground` | `bg-sidebar` / `text-sidebar-foreground` | `#fafafa` / `#0a0a0a` | `#171717` / `#fafafa` | Sidebar surface and text |
| `--sidebar-primary` / `--sidebar-primary-foreground` | `bg-sidebar-primary` / `text-sidebar-primary-foreground` | `#211f26` / `#fafafa` | `#0588f0` / `#fafafa` | Active / primary nav item |
| `--sidebar-accent` / `--sidebar-accent-foreground` | `bg-sidebar-accent` / `text-sidebar-accent-foreground` | `#f5f5f5` / `#171717` | `#262626` / `#fafafa` | Sidebar hover / accent |
| `--sidebar-border` | `border-sidebar-border` | `#d4d4d4` | `rgb(255 255 255 / 0.8)` | Sidebar borders / separators |
| `--sidebar-ring` | `ring-sidebar-ring` | `#737373` | `#737373` | Focus ring inside the sidebar |

**Kit-specific extras** (not standard shadcn — kept for 1:1 fidelity with the kit)

| Variable | Utility | Light | Dark | Purpose |
| --- | --- | --- | --- | --- |
| `--background-color` | `bg-background-color` | `rgb(0 0 0 / 0.3)` | `rgb(0 0 0 / 0.3)` | Overlay / scrim behind modals |
| `--semantic-background` | `bg-semantic-background` | `#6b7280` | `#374151` | Kit "semantic" surface |
| `--semantic-foreground` | `text-semantic-foreground` | `#ffffff` | `#ffffff` | Text on semantic surface |
| `--semantic-border` | `border-semantic-border` | `#4b5563` | `#4b5563` | Kit "semantic" border |

> **Note on `--destructive`:** the kit (matching shadcn defaults) ships `--destructive` as a **single token with no `--destructive-foreground`**. This is the one documented exception to the `name` / `name-foreground` pairing rule in §2.1. If a design needs a dedicated on-destructive text color, add `--destructive-foreground` to both `:root` and `.dark` and register it in `@theme inline` per [§9](#9-adding-custom-tokens) — don't assume it already exists.

> Every variable above is defined in **both** `:root` (light) and `.dark` (dark) in `globals.css`. Never hardcode the dark values — they switch automatically via the `.dark` selector (see [§10 Dark Mode](#10-dark-mode)).

### 2.4 Color format

Values are the kit's **exact sRGB output**, written as hex (`#rrggbb`) or `rgb(r g b / a)` when the kit token carries alpha. They are aliases of the kit's `tw-colors` collection (the Tailwind palette), so each value traces back to a named swatch — e.g. `--primary` light = `neutral/900` = `#171717`, `--primary-foreground` = `neutral/50` = `#fafafa`. sRGB is used — not OKLCH — so code is byte-identical to the original Figma. If you need OKLCH later, convert at high precision; do not eyeball it, or the kit match breaks.

### 2.5 Base color

The kit **overrides** the stock `tailwind.baseColor` preset. `components.json` still records `neutral`, but the live values come from the Figma export, not `npx shadcn@latest init`. Do not run a preset/theme swap (`apply --preset`) — it would overwrite the kit-synced values. Re-sync from Figma instead.

---

## 3. Border Radius

The kit uses the **Tailwind v4 static radius scale** (fixed rem per step) — *not* shadcn's `calc(var(--radius) * n)` system. `--radius` is retained at `0.5rem` (8px = `rounded-lg`, the kit default) for any shadcn component that reads it directly.

| Utility | Token (`@theme inline`) | Value | px | Use for |
| --- | --- | --- | --- | --- |
| `rounded-none` | — | `0` | 0 | Square edges |
| `rounded-xs` | `--radius-xs` | `0.125rem` | 2 | Hairline rounding |
| `rounded-sm` | `--radius-sm` | `0.25rem` | 4 | Small chips, badges |
| `rounded-md` | `--radius-md` | `0.375rem` | 6 | Buttons, inputs, selects |
| `rounded-lg` | `--radius-lg` | `0.5rem` | 8 | Cards, popovers, dialogs (**kit default**) |
| `rounded-xl` | `--radius-xl` | `0.75rem` | 12 | Large containers |
| `rounded-2xl` | `--radius-2xl` | `1rem` | 16 | Hero surfaces |
| `rounded-3xl` | `--radius-3xl` | `1.5rem` | 24 | Extra-large surfaces |
| `rounded-4xl` | `--radius-4xl` | `2rem` | 32 | Oversized / marketing |
| `rounded-full` | — | `9999px` | — | Pills, avatars, icon buttons |

To re-shape the UI, re-export the kit's `border-radius` collection and regenerate `@theme inline` — keep code and Figma in lockstep.

---

## 4. Typography

### 4.1 Font families (from the kit)

| Variable | Stack | Source |
| --- | --- | --- |
| `--font-sans` | `var(--font-google-sans), "Inter", ui-sans-serif, system-ui, sans-serif` | kit `family/sans` = Google Sans |
| `--font-mono` | `var(--font-geist-mono), "Geist Mono", ui-monospace, SFMono-Regular, monospace` | kit `family/mono` = Geist Mono |

Set in `@theme inline`. **The font is data-driven from the Figma `family/*` token, not a project default.** For this kit it resolves to **Google Sans** (sans) and **Geist Mono** (mono) — both **bundled** as local variable fonts in [`app/fonts/`](./app/fonts) and wired via `next/font/local` in `app/layout.tsx` (`--font-google-sans`, `--font-geist-mono`). If the Figma file specifies different fonts, re-export and regenerate `--font-*` (don't hardcode). 

To swap a font, drop the file in `app/fonts/`, register it with `localFont({ variable: "--font-x" })`, and point `--font-sans`/`--font-mono` at it in `globals.css`.

For Thai projects, append a Thai sans (e.g. Noto Sans Thai, IBM Plex Sans Thai) to the `--font-sans` stack so Thai glyphs resolve automatically.

### 4.2 Font size (Tailwind v4 default = kit `size/*`)

| Utility | Size | px | Line-height |
| --- | --- | --- | --- |
| `text-xs` | `0.75rem` | 12 | `calc(1 / 0.75)` ≈ 16px |
| `text-sm` | `0.875rem` | 14 | `calc(1.25 / 0.875)` ≈ 20px |
| `text-base` | `1rem` | 16 | `1.5` = 24px |
| `text-lg` | `1.125rem` | 18 | `calc(1.75 / 1.125)` ≈ 28px |
| `text-xl` | `1.25rem` | 20 | `calc(1.75 / 1.25)` ≈ 28px |
| `text-2xl` | `1.5rem` | 24 | `calc(2 / 1.5)` ≈ 32px |
| `text-3xl` | `1.875rem` | 30 | `calc(2.25 / 1.875)` ≈ 36px |
| `text-4xl` | `2.25rem` | 36 | `calc(2.5 / 2.25)` ≈ 40px |
| `text-5xl` | `3rem` | 48 | `1` |
| `text-6xl` | `3.75rem` | 60 | `1` |
| `text-7xl` | `4.5rem` | 72 | `1` |
| `text-8xl` | `6rem` | 96 | `1` |
| `text-9xl` | `8rem` | 128 | `1` |

### 4.3 Font weight (kit `weight/*` = Tailwind v4)

`font-thin` 100 · `font-extralight` 200 · `font-light` 300 · `font-normal` 400 · `font-medium` 500 · `font-semibold` 600 · `font-bold` 700 · `font-extrabold` 800 · `font-black` 900

### 4.4 Letter-spacing (kit `tracking/*`, px @16 = Tailwind v4 em)

`tracking-tighter` `-0.05em` (−0.8px) · `tracking-tight` `-0.025em` (−0.4px) · `tracking-normal` `0` · `tracking-wide` `0.025em` (0.4px) · `tracking-wider` `0.05em` (0.8px) · `tracking-widest` `0.1em` (1.6px)

### 4.5 Line-height (kit `leading/*`)

Numeric, spacing-derived (`leading-<n>` = `n × 0.25rem`): `leading-3` 12px · `-4` 16 · `-5` 20 · `-6` 24 · `-7` 28 · `-8` 32 · `-9` 36 · `-10` 40 · `-12` 48 · `-15` 60 · `-18` 72 · `-24` 96 · `-32` 128. Named utilities (`leading-none/tight/snug/normal/relaxed/loose`) remain available from Tailwind v4 defaults.

---

## 5. Spacing & Sizing

Tailwind v4 derives every spacing/sizing utility from one base: `--spacing: 0.25rem` (4px). Any `p-*`, `m-*`, `gap-*`, `space-*`, `w-*`, `h-*`, `size-*`, `inset-*`, `translate-*` value `n` = `n × 0.25rem`. This matches the kit's `padding`, `margin`, `space`, and `gap` collections exactly.

| Token | rem | px | Token | rem | px |
| --- | --- | --- | --- | --- | --- |
| `0` | 0 | 0 | `6` | 1.5rem | 24 |
| `0.5` | 0.125rem | 2 | `8` | 2rem | 32 |
| `1` | 0.25rem | 4 | `10` | 2.5rem | 40 |
| `1.5` | 0.375rem | 6 | `12` | 3rem | 48 |
| `2` | 0.5rem | 8 | `14` | 3.5rem | 56 |
| `2.5` | 0.625rem | 10 | `16` | 4rem | 64 |
| `3` | 0.75rem | 12 | `20` | 5rem | 80 |
| `3.5` | 0.875rem | 14 | `24` | 6rem | 96 |
| `4` | 1rem | 16 | `32` | 8rem | 128 |
| `5` | 1.25rem | 20 | `…` | `n × 0.25rem` | |

Two non-negotiable rules:

1. **`gap-*` on flex/grid parents — never `space-x-*` or `space-y-*`.**
   - `flex flex-col gap-4` for vertical stacks
   - `flex gap-2` for horizontal rows
2. **`size-*` when width and height are equal.**
   - `size-10` instead of `w-10 h-10`
   - Applies to icons, avatars, skeletons

---

## 6. Shadows & Effects

Effect styles are synced 1:1 from the Figma kit (`Box Shadow/*`) into `@theme inline`. Every layer uses `#0000001A` (black @ 10%). The kit defines xs/sm/md/lg plus a Focus ring; xl/2xl fall back to Tailwind v4 defaults.

| Utility | Value | Source |
| --- | --- | --- |
| `shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.1)` | **kit** (`Box Shadow/shadow-xs`) |
| `shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1)` | **kit** (`Box Shadow/shadow-sm`) |
| `shadow-md` | `0 2px 4px -2px rgb(0 0 0 / 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.1)` | **kit** (`Box Shadow/shadow-md`) |
| `shadow-lg` | `0 4px 6px -4px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)` | **kit** (`Box Shadow/shadow-lg`) |
| `shadow-focus` | `0 0 0 3px rgb(161 161 161 / 0.5)` | **kit** (`Box Shadow/Focus ring`) |
| `shadow-xl` / `shadow-2xl` / `shadow-none` | Tailwind v4 defaults | not in kit |

**Opacity:** use Tailwind opacity modifiers (`bg-primary/30`, `opacity-80`). The kit's `--background-color` (`rgb(0 0 0 / 0.3)`) is the standard modal/scrim overlay — apply via `bg-background-color`.

---

## 7. Borders

| Utility | Width | Note |
| --- | --- | --- |
| `border` | 1px | Default; color from `--border` (`border-border` applied to `*` in `@layer base`) |
| `border-0` | 0 | |
| `border-2` | 2px | |
| `border-4` | 4px | |
| `border-8` | 8px | |

Directional variants (`border-t/r/b/l/x/y` and `-s/-e` logical) follow the same `0 / 1 / 2 / 4 / 8` scale — matching the kit's `border-width` collection. Border **color** is always the `--border` token; never a raw color. Focus outlines use `--ring` (`outline-ring/50`, `ring-ring`). Icon stroke widths (lucide) follow the kit's `stroke-width` scale (`0.5`–`3`); default lucide stroke is `2`.

---

## 8. Component Composition Rules

These come straight from the official `shadcn-ui/ui/skills/shadcn` skill. They apply universally to every component, AI-generated or hand-written.

### 8.1 Forms

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
    <FieldDescription>Helper text.</FieldDescription>
  </Field>
</FieldGroup>
```

- Validation: `data-invalid` on **Field**, `aria-invalid` on the **control**
- Disabled: `data-disabled` on Field, `disabled` on the control
- `InputGroup` uses `InputGroupInput` / `InputGroupTextarea` — never raw `Input` / `Textarea` inside it
- Option sets (2–7 choices) use `ToggleGroup`
- `FieldSet` + `FieldLegend` for grouping checkboxes/radios

### 8.2 Composition

- **Items inside their Group.** `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`, `CommandItem` → `CommandGroup`.
- **Custom triggers:** `asChild` (Radix) or `render` (Base UI). Check `base` field via `npx shadcn@latest info`.
- **Overlay accessibility:** Dialog, Sheet, Drawer always need a Title.

### 8.3 Icons

- Use the project's configured `iconLibrary` (this project: `lucide`).
- Inside Buttons: `data-icon`, no sizing classes.
- Outside Buttons: `size-4`, `size-5`, etc.

### 8.4 Status colors

Use Badge variants or semantic tokens — never raw Tailwind colors.

```tsx
// ✅ Correct
<Badge variant="secondary">+20.1%</Badge>
<span className="text-destructive">-3.2%</span>

// ❌ Wrong
<span className="text-emerald-600">+20.1%</span>
```

---

## 9. Adding Custom Tokens

Edit `app/globals.css` directly. Never create a new CSS file. Use the kit's sRGB format (not OKLCH) so new tokens match the existing convention.

```css
/* 1. Define under :root and .dark */
:root {
  --warning: #f59e0b;
  --warning-foreground: #451a03;
}
.dark {
  --warning: #b45309;
  --warning-foreground: #fffbeb;
}

/* 2. Register with Tailwind v4 */
@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Now usable as `bg-warning` and `text-warning-foreground`. Add the matching variable to the Figma `shadcn/ui` collection (both modes) in the same change so design and code stay 1:1.

---

## 10. Dark Mode

Class-based toggle via `.dark` on the root element. For Next.js, use `next-themes`:

```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

**Never use manual `dark:` color overrides.** Semantic tokens auto-switch via the `.dark` selector, mirroring the kit's `dark mode`.

```tsx
// ✅ Correct
<div className="bg-background text-foreground" />

// ❌ Wrong
<div className="bg-white text-black dark:bg-gray-950 dark:text-white" />
```

---

## 11. Figma ↔ Code Alignment

Figma is the source of design intent **and** of token values; code mirrors it. Both must reference the **same token names**.

### 11.1 Figma Variables structure

The export (`tokens.json`) mirrors the three-tier model as token sets:

```
tw-colors      → raw Tailwind palette (neutral.900, …)  + rdx-colors  [Tier 1]
shadcn-ui      → background, foreground, primary, …  (aliases)         [Tier 2]
padding · space · margin · gap · border-radius · border-width ·
font · opacity · height · max-width · …                               [Tier 3 scales]
```

Semantic variables in `shadcn-ui` use the **same names** as CSS variables (without `--`): `background`, `primary`, `primary-foreground`. This is what makes Figma MCP and Code Connect resolve correctly.

> Note: this export has a few Figma-side name typos (`backgrund`, `*-foregrund`, `Card`) that are normalized to the correct CSS variable names during sync. Fix them at the Figma source so the export self-documents. `--sidebar` is also bound to `neutral-500` in the source (likely an error) — see the flag in `globals.css`.

### 11.2 Modes for light/dark

This export ships **light mode only** (`shadcn-ui/Mode 1` → `:root`). There is no dark token set, so `.dark` in `globals.css` carries shadcn's canonical neutral dark values as a default. When a dark mode is added in Figma, re-export and regenerate `.dark` — never hand-edit values.

### 11.3 Figma MCP server tools

| Tool | Returns |
| --- | --- |
| `get_design_context` | Structured React + Tailwind for the node, plus Code Connect snippets |
| `get_metadata` | High-level node map (use when design context is too large) |
| `get_screenshot` | Visual reference of the node variant |
| `get_variable_defs` | Variables and styles used (color, spacing, typography) |

Workflow detail and strict 1:1 fidelity rules are in [`.claude/skills/shadcn-ui-tailwind-figma/SKILL.md`](./.claude/skills/shadcn-ui-tailwind-figma/SKILL.md). `get_variable_defs` needs a layer/frame node (not a page); if access fails, run `whoami` and confirm the file is shared with the authenticated account.

### 11.4 Recommended Figma kits

These are listed on the official shadcn/ui Figma page and ship pre-aligned with shadcn variables and Tailwind v4:

- **Shadcnblocks.com** — components, 500+ pro blocks, theme variables, Figma MCP ready
- **Obra shadcn/ui Pro** (Obra Studio) — variable consistency with shadcn, design-to-code plugin
- **shadcn/ui kit** (Matt Wierzbicki) — premium, always up-to-date
- **shadcncraft Design System** — Pro React blocks, 1:1 Figma alignment, tweakcn theming
- **shadcn/studio UI Kit** — 550+ blocks, 10+ templates, 20+ themes, AI design-to-code tool
- **shadcn/ui components** (Sitsiilia Bergmann) — community, regularly maintained
- **shadcn/ui design system** (Pietro Schirano) — designer companion, 1:1 with code

### 11.5 Code Connect

For Figma Organization/Enterprise plans, **Code Connect** links Figma components to their `components/ui/<name>.tsx` source files. Dev Mode then shows real code snippets, and MCP responses include the exact component path and prop types.

---

## 12. References

All values and rules verified from these official sources:

- Token source of truth: [`tokens.json`](./tokens.json) — Figma DTCG export, `shadcn-ui/Mode 1` token set
- shadcn/ui — Theming: <https://ui.shadcn.com/docs/theming>
- shadcn/ui — Tailwind v4: <https://ui.shadcn.com/docs/tailwind-v4>
- shadcn/ui — Installation: <https://ui.shadcn.com/docs/installation>
- shadcn/ui — components.json: <https://ui.shadcn.com/docs/components-json>
- shadcn/ui — Figma: <https://ui.shadcn.com/docs/figma>
- shadcn/ui — Changelog: <https://ui.shadcn.com/docs/changelog>
- Tailwind CSS v4 — Theme: <https://tailwindcss.com/docs/theme>
- Official shadcn AI skill: <https://github.com/shadcn-ui/ui/tree/main/skills/shadcn>
- Figma Dev Mode MCP: <https://www.figma.com/blog/introducing-figmas-dev-mode-mcp-server/>
- Figma MCP server guide: <https://github.com/figma/mcp-server-guide>
