#!/usr/bin/env node
/**
 * migrate-legacy-tokens.mjs — Phase 1 of the DS v2 token migration.
 *
 * Deterministically (re)generates the canonical DTCG token layer under
 * `tokens/` from the two legacy sources, which stay authoritative for the
 * still-running legacy pipeline (build-token-data / build-brand):
 *
 *   tokens.json        → tokens/raw/legacy.tokens.json  (byte copy)
 *                      → tokens/primitive/*.json         (normalized, source prefixes dropped)
 *   brand.config.json  → tokens/raw/legacy.brand.config.json (byte copy)
 *                      → tokens/semantic/*.json, tokens/mode/dark.json,
 *                        tokens/theme/neutral.json       (aliases into primitives)
 *
 * Decisions (see tokens/README.md):
 *   - Tailwind families become canonical `color.<family>.<step>`; the Radix
 *     palette is NOT promoted (zero consumers) and lives only in raw/legacy.
 *   - Brand ramps become `color.brand.<name>.<step>`.
 *   - px dimensions are normalized to rem (px/16); the original value is kept
 *     in $extensions["looloo.legacy"].
 *   - Semantic keys stay flat kebab-case (`primary-foreground`) to map 1:1 to
 *     the existing CSS custom properties.
 *
 * Nothing in the app consumes these files yet — Phase 2 adds validate/build.
 *
 * Run: npm run tokens:migrate
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toOklch } from "../lib-oklch.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const out = (...p) => join(root, "tokens", ...p)

/* ---------- 0. preserve legacy sources as raw copies ---------- */
for (const d of ["raw", "primitive", "semantic", "component", "mode", "theme"])
  mkdirSync(out(d), { recursive: true })
copyFileSync(join(root, "tokens.json"), out("raw", "legacy.tokens.json"))
copyFileSync(join(root, "brand.config.json"), out("raw", "legacy.brand.config.json"))

const legacy = JSON.parse(readFileSync(out("raw", "legacy.tokens.json"), "utf8"))
const brand = JSON.parse(readFileSync(out("raw", "legacy.brand.config.json"), "utf8"))

/* ---------- helpers ---------- */
// Legacy numeric px scale ("tokens/Mode 1"): key "1,5" → value "1.5px".
const numScale = {}
for (const [k, v] of Object.entries(legacy["tokens/Mode 1"] ?? {})) {
  if (v && typeof v === "object" && "$value" in v)
    numScale[k.replace(/,/g, ".")] = v.$value
}
/** Resolve a legacy "{ref}" (e.g. "{6}", "{1,5}") to its px number, or null. */
function refPx(val) {
  const m = /^\{(.+)\}$/.exec(String(val))
  const key = m ? m[1].replace(/,/g, ".") : null
  const raw = key != null ? numScale[key] : val
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : null
}
const trim = (n) => String(parseFloat(n.toFixed(4)))
const pxToRem = (px) => (px === 0 ? "0" : `${trim(px / 16)}rem`)
const token = (type, value, description, extensions) => {
  const t = { $type: type, $value: value }
  if (description) t.$description = description
  if (extensions) t.$extensions = extensions
  return t
}
// Hand-authored tiers migrate must NOT regenerate (Phase 3, RFC retire-legacy-token-pipeline).
// color.json is already read-only (its writeJson was removed). These are brand-agnostic scales
// with no downstream reader in migrate — they are now the source of truth in tokens/.
const HAND_AUTHORED = new Set([
  "primitive/spacing.json", "primitive/opacity.json", "primitive/border.json",
  "primitive/shadow.json", "primitive/sizing.json", "primitive/z-index.json",
  "semantic/color.json", "semantic/status.json", "mode/dark.json", // Phase 4 slice 4: hand-authored (migrate no longer generates ANY tokens). NOTE: still brand-baked; brand-agnostic-via-theme is the final refinement.
  "primitive/typography.json", // Phase 4 slice 3: font-family (brand) — value also in theme overlay; primitive var unused
  "primitive/radius.json", // Phase 4 slice 2: hand-authored kit steps + calc(var(--radius)) ui scale
  "theme/neutral.json", // Phase 4: owned by scripts/tokens/build-theme.mjs (brand.config → theme overlay)
])
const writeJson = (path, obj) => {
  if (HAND_AUTHORED.has(path.join("/"))) return // hand-authored — migrate does not regenerate
  writeFileSync(out(...path), JSON.stringify(obj, null, 2) + "\n")
}

/* ---------- 1. primitive/color.json — HAND-AUTHORED (Phase 3, RFC retire-legacy-token-pipeline) ---------- */
// The palette is now the source of truth: tokens/primitive/color.json is authored by hand and is
// NOT regenerated from legacy tokens.json. migrate only READS it to build the oklch→path map used
// to alias semantic brand values to primitive paths. (Figma → palette is now a one-off import tool,
// not a pipeline stage.)
const primByOklch = {}
{
  const paletteTree = JSON.parse(readFileSync(out("primitive", "color.json"), "utf8")).color
  const walk = (node, path) => {
    if (node && typeof node === "object" && node.$type === "color" && "$value" in node) {
      const ok = toOklch(node.$value)
      if (!(ok in primByOklch)) primByOklch[ok] = path // first-wins (tw families before color.brand.*)
      return
    }
    if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, `${path}.${k}`)
  }
  for (const [k, v] of Object.entries(paletteTree)) if (!k.startsWith("$")) walk(v, `color.${k}`)
}

/* ---------- 2. primitive/spacing.json ---------- */
// Tailwind 4px-grid steps; values are step*0.25rem, verified against the
// legacy numeric px scale where present.
const SPACE_STEPS = [
  "0", "0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "5", "6", "7", "8",
  "9", "10", "11", "12", "14", "16", "20", "24", "28", "32", "36", "40",
  "44", "48", "52", "56", "60", "64", "72", "80", "96",
]
const space = {
  px: token("dimension", "1px", "Hairline step (Tailwind space-px)."),
}
for (const s of SPACE_STEPS) {
  const px = parseFloat(s) * 4
  // DTCG token names must not contain "." — fractional steps use "-" (0.5 → "0-5")
  // so aliases like {space.2-5} stay unambiguous.
  space[s.replace(".", "-")] = token("dimension", pxToRem(px), undefined, {
    "looloo.legacy": numScale[String(px)] ?? `${px}px`,
    "looloo.tailwind": `*-${s}`,
  })
}
writeJson(["primitive", "spacing.json"], {
  $description:
    "Canonical spacing scale (rem, 4px grid) — the legacy gap/margin/padding/space collections all alias this one scale. Generated; do not hand-edit.",
  space,
})

/* ---------- 3. primitive/radius.json ---------- */
const radius = {}
for (const [k, v] of Object.entries(legacy["border-radius/Mode 1"] ?? {})) {
  const m = /^rounded-(none|full|xs|sm|md|lg|xl|2xl|3xl|4xl)$/.exec(k)
  if (!m) continue // corner/side variants (rounded-s-*, …) alias the same steps
  const name = m[1]
  const px = refPx(v.$value)
  const value = name === "full" ? "9999px" : px != null ? pxToRem(px) : v.$value
  radius[name] = token("dimension", value,
    "Static Figma-kit step — NOT what components render. Kept for parity with the kit export; use radius.ui.* for component work.",
    { "looloo.legacy": v.$value })
}

// radius.ui.* — the scale components actually render with. It is derived from
// the brand's --radius (theme.<brand>.radius), so a brand fork rescales every
// corner by changing one number. Emitted as calc() so the derivation stays live
// at runtime, exactly as app/globals.css did before this scale moved here.
// Multipliers chosen so every step lands on a WHOLE pixel at the brand radius (12px):
// 6 · 9 · 12 · 18 · 24 · 30 · 36. The previous set (0.6/0.8/1.4/1.8/2.2/2.6) was tuned for a
// 10px base and would render 7.2 / 9.6 / 16.8 — fractional corners that blur on non-retina.
// OFFSETS from the brand radius, not multipliers. A ratio (0.75 × 12) gives 9 — a whole number,
// but off the 4px grid every other dimension in the system lands on. Offsets keep every step on the
// grid for ANY brand radius that is itself a multiple of 4: at --radius 12 this is 4 · 8 · 12 · 16 · 24 · 32 · 40.
const UI_OFFSETS = { sm: -8, md: -4, lg: 0, xl: 4, "2xl": 12, "3xl": 20, "4xl": 28 }
const brandRadiusPx = parseFloat(brand.radius ?? "0.625rem") * 16
radius.ui = {}
for (const [name, offset] of Object.entries(UI_OFFSETS)) {
  radius.ui[name] = token(
    "dimension",
    offset === 0 ? "var(--radius)" : `calc(var(--radius) ${offset < 0 ? "-" : "+"} ${Math.abs(offset)}px)`,
    `rounded-${name} = ${brandRadiusPx + offset}px at the current --radius (${brand.radius ?? "0.75rem"}). Offsets, not ratios: a ratio lands off the 4px grid (0.75 × 12 = 9).`,
    { "looloo.offset": offset }
  )
}
writeJson(["primitive", "radius.json"], {
  $description:
    "Canonical radius. radius.* = static Figma-kit steps (kit parity). radius.ui.* = the calc() scale the components render with, derived from --radius. Generated; do not hand-edit.",
  radius,
})

/* ---------- 4. primitive/typography.json ---------- */
const fontSrc = legacy["font/Mode 1"] ?? {}
const font = { family: {}, size: {}, weight: {}, leading: {}, tracking: {} }
for (const [k, v] of Object.entries(fontSrc.family ?? {}))
  font.family[k] = token("fontFamily", v.$value,
    "Runtime stack lives in app/globals.css (--font-sans/--font-mono via next/font).")
for (const [k, v] of Object.entries(fontSrc.size ?? {})) {
  const px = refPx(v.$value)
  if (px != null)
    font.size[k] = token("dimension", pxToRem(px), undefined, { "looloo.legacy": v.$value })
}
for (const [k, v] of Object.entries(fontSrc.weight ?? {})) {
  const n = refPx(v.$value) // weights are stored as {100}…{900} refs
  if (n != null) font.weight[k] = token("fontWeight", n, undefined, { "looloo.legacy": v.$value })
}
for (const [k, v] of Object.entries(fontSrc.leading ?? {})) {
  const px = refPx(v.$value)
  if (px != null)
    font.leading[k] = token("dimension", pxToRem(px), undefined, { "looloo.legacy": v.$value })
}
for (const [k, v] of Object.entries(fontSrc.tracking ?? {})) {
  const px = refPx(v.$value)
  if (px != null)
    font.tracking[k] = token("dimension", `${trim(px)}px`,
      "Figma letter-spacing in px; Tailwind's em-based tracking utilities remain authoritative at runtime.",
      { "looloo.legacy": v.$value })
}
writeJson(["primitive", "typography.json"], {
  $description: "Canonical typography primitives. Generated; do not hand-edit.",
  font,
})

/* ---------- 5. primitive/opacity.json ---------- */
const opacity = {}
for (const [k, v] of Object.entries(legacy["opacity/Mode 1"] ?? {})) {
  const m = /^opacity-(\d+)$/.exec(k)
  if (!m) continue
  opacity[m[1]] = token("number", parseInt(m[1], 10) / 100, undefined, {
    "looloo.legacy": v.$value,
  })
}
writeJson(["primitive", "opacity.json"], {
  $description: "Canonical opacity scale (0–1). Generated; do not hand-edit.",
  opacity,
})

/* ---------- 6. primitive/border.json ---------- */
const borderWidth = {}
for (const [k, v] of Object.entries(legacy["border-width/Mode 1"] ?? {})) {
  const m = /^border(?:-(\d+))?$/.exec(k)
  if (!m) continue
  const px = refPx(v.$value)
  if (px == null) continue
  borderWidth[m[1] ?? "default"] = token("dimension", `${trim(px)}px`, undefined, {
    "looloo.legacy": v.$value,
  })
}
writeJson(["primitive", "border.json"], {
  $description:
    "Canonical border widths (px, matching Tailwind). Side/axis legacy variants alias these. Generated; do not hand-edit.",
  border: { width: borderWidth },
})

/* ---------- 7. primitive/shadow.json (from app/globals.css effect styles) ---------- */
writeJson(["primitive", "shadow.json"], {
  $description:
    "Effect styles synced 1:1 from the Figma kit (Box Shadow/*), mirrored from app/globals.css @theme. globals.css stays authoritative until Phase 2.",
  shadow: {
    xs: token("shadow", "0 1px 2px 0 rgb(0 0 0 / 0.1)"),
    sm: token("shadow", "0 1px 3px 0 rgb(0 0 0 / 0.1)"),
    md: token("shadow", "0 2px 4px -2px rgb(0 0 0 / 0.1), 0 4px 6px -1px rgb(0 0 0 / 0.1)"),
    lg: token("shadow", "0 4px 6px -4px rgb(0 0 0 / 0.1), 0 10px 15px -3px rgb(0 0 0 / 0.1)"),
    focus: token("shadow", "0 0 0 3px rgb(161 161 161 / 0.5)", "Mirrors the kit's Focus ring effect."),
  },
})

/* ---------- 8. primitive/motion.json (from brand axes) ---------- */
const axes = brand.axes ?? {}
writeJson(["primitive", "motion.json"], {
  $description:
    "Motion primitives, sourced from brand.config.json axes (--duration-base / --ease-brand in the current pipeline).",
  duration: { base: token("duration", axes.duration ?? "200ms") },
  ease: { standard: token("cubicBezier", axes.ease ?? "cubic-bezier(0.4, 0, 0.2, 1)") },
})

/* ---------- 9. primitive/sizing.json ---------- */
// size.<px> — the open-ended box scale. Starts at 8 (the smallest thing we ever
// draw: an avatar badge dot) and climbs. Every fixed square/box in the component
// layer — icons, indicators, thumbs, dots, rails — aliases a step here instead
// of carrying a literal. 2px steps through the icon range where the difference
// is visible, then 4px, then 8px+ once boxes are large enough that finer steps
// are noise.
const SIZE_STEPS = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 128]
const SIZE_NOTES = {
  8: "Smallest box in the system — avatar badge (size sm).",
  12: "Icon xs.",
  14: "Icon sm — breadcrumb chevron, copy buttons.",
  16: "Icon md — the default icon size across the library.",
  20: "Icon lg. Also kbd / token (size sm) height.",
  22: "Combobox chip height.",
  24: "Icon xl — alert-dialog media icon.",
  32: "Avatar / icon-button default box.",
  40: "Alert-dialog media box.",
  48: "Sidebar icon rail width.",
}
writeJson(["primitive", "sizing.json"], {
  $description:
    "Box sizing — the open-ended square/box scale (starts at 8, climbs). Every fixed box in the component layer aliases a step here. Control HEIGHTS are not raw values but a decision, so they live one layer up: semantic/sizing.json (size.control.*) aliases back into this scale.",
  size: Object.fromEntries(
    SIZE_STEPS.map((px) => [String(px), token("dimension", pxToRem(px), SIZE_NOTES[px])])
  ),
})

/* ---------- 10. primitive/z-index.json ---------- */
writeJson(["primitive", "z-index.json"], {
  $description: "Layering scale (Tailwind-compatible steps; overlays currently use z-50).",
  "z-index": Object.fromEntries(
    ["0", "10", "20", "30", "40", "50"].map((z) => [z, token("number", parseInt(z, 10))])
  ),
})

/* ---------- 11. semantic/color.json + mode/dark.json (from brand.config.json) ---------- */
// Alias a brand.config value to its canonical primitive path when the OKLCH matches.
// "What it controls" — verbatim from https://ui.shadcn.com/docs/theming. These are
// the ROLE of each token; they are the reason we do not carry a parallel
// surface/content/border naming layer.
const SHADCN_ROLE = {
  background: "The default app background and text color.",
  foreground: "The default app background and text color.",
  card: "Elevated surfaces and the content inside them.",
  "card-foreground": "Elevated surfaces and the content inside them.",
  popover: "Floating surfaces and the content inside them.",
  "popover-foreground": "Floating surfaces and the content inside them.",
  primary: "High-emphasis actions and brand surfaces.",
  "primary-foreground": "High-emphasis actions and brand surfaces.",
  secondary: "Lower-emphasis filled actions and supporting surfaces.",
  "secondary-foreground": "Lower-emphasis filled actions and supporting surfaces.",
  muted: "Subtle surfaces and lower-emphasis content.",
  "muted-foreground": "Subtle surfaces and lower-emphasis content.",
  accent: "Interactive hover, focus, and active surfaces.",
  "accent-foreground": "Interactive hover, focus, and active surfaces.",
  destructive: "Destructive actions and error emphasis.",
  border: "Default borders and separators.",
  input: "Form control borders and input surface treatment.",
  ring: "Focus rings and outlines.",
  "chart-1": "The default chart palette.",
  "chart-2": "The default chart palette.",
  "chart-3": "The default chart palette.",
  "chart-4": "The default chart palette.",
  "chart-5": "The default chart palette.",
  sidebar: "The base sidebar surface and default sidebar text.",
  "sidebar-foreground": "The base sidebar surface and default sidebar text.",
  "sidebar-primary": "High-emphasis actions inside the sidebar.",
  "sidebar-primary-foreground": "High-emphasis actions inside the sidebar.",
  "sidebar-accent": "Hover and selected states inside the sidebar.",
  "sidebar-accent-foreground": "Hover and selected states inside the sidebar.",
  "sidebar-border": "Sidebar-specific borders and separators.",
  "sidebar-ring": "Sidebar-specific focus rings.",
}
const role = (k) =>
  SHADCN_ROLE[k] ?? "Kit extra — not part of the shadcn contract. Prefer a shadcn-named role."

function semanticValue(v, k) {
  const ok = toOklch(v)
  const path = primByOklch[ok]
  return path
    ? token("color", `{${path}}`, role(k), { "looloo.resolved": ok })
    : token("color", ok, role(k), { "looloo.legacy": String(v) })
}
const semanticColor = {}
for (const [k, v] of Object.entries(brand.light ?? {})) semanticColor[k] = semanticValue(v, k)
// Solid-shade surface tokens (PR #33 — component color tier collapsed into semantic).
// Same-hue solid shades (not color-mix tints); dark shades live in mode/dark.json.
Object.assign(semanticColor, {
  "destructive-surface": token("color", "{color.red.50}", "Destructive surface (solid tint). Dark: red.950."),
  "destructive-surface-hover": token("color", "{color.red.100}", "Destructive surface, hover. Dark: red.900."),
  "destructive-border": token("color", "{color.red.200}", "Destructive border on a destructive surface. Dark: red.800."),
  "primary-surface": token("color", "{color.brand.primary.50}", "Primary surface (solid tint): selected row, file-upload dropzone-active. Dark: brand-primary.950."),
  "secondary-hover": token("color", "{color.gray.200}", "Secondary control hover fill (solid). Dark: gray.700."),
  "secondary-surface-hover": token("color", "{color.gray.100}", "Secondary badge hover surface (solid). Dark: gray.800."),
  "muted-surface": token("color", "{color.gray.50}", "Muted row/hover surface (solid). Dark: gray.900."),
  "input-surface": token("color", "{color.gray.100}", "Subtle input/command background (solid). Dark: gray.800."),
  "ring-subtle": token("color", "{color.gray.200}", "Subtle ring/outline paint (solid). Dark: gray.700."),
})
writeJson(["semantic", "color.json"], {
  $description:
    "Semantic color layer (light) generated from tokens/raw/legacy.brand.config.json. Keys are the shadcn contract — they map 1:1 onto the shipped CSS custom properties (--primary, --primary-foreground, …) and every $description is the token's ROLE, quoted verbatim from https://ui.shadcn.com/docs/theming ('What it controls'). This is the ONE color vocabulary: components pick from here, not from a parallel surface/content/border naming. brand.config.json remains the brand-override input; regenerate after brand changes.",
  color: semanticColor,
})
const darkColor = {}
for (const [k, v] of Object.entries(brand.dark ?? {})) darkColor[k] = semanticValue(v, k)
// Dark overrides for the solid-shade surfaces (PR #33): light shade -> dark shade.
Object.assign(darkColor, {
  "destructive-surface": token("color", "{color.red.950}", "Dark override for --destructive-surface."),
  "destructive-surface-hover": token("color", "{color.red.900}", "Dark override for --destructive-surface-hover."),
  "destructive-border": token("color", "{color.red.800}", "Dark override for --destructive-border."),
  "primary-surface": token("color", "{color.brand.primary.950}", "Dark override for --primary-surface."),
  "secondary-hover": token("color", "{color.gray.700}", "Dark override for --secondary-hover."),
  "secondary-surface-hover": token("color", "{color.gray.800}", "Dark override for --secondary-surface-hover."),
  "muted-surface": token("color", "{color.gray.900}", "Dark override for --muted-surface."),
  "input-surface": token("color", "{color.gray.800}", "Dark override for --input-surface."),
  "ring-subtle": token("color", "{color.gray.700}", "Dark override for --ring-subtle."),
})
const darkStatus = {
  "success-surface": token("color", "{color.green.950}", "Dark override for --status-success-surface."),
  "success-surface-hover": token("color", "{color.green.900}", "Dark override for --status-success-surface-hover."),
  "success-border": token("color", "{color.green.800}", "Dark override for --status-success-border."),
  "warning-surface": token("color", "{color.amber.950}", "Dark override for --status-warning-surface."),
  "warning-surface-hover": token("color", "{color.amber.900}", "Dark override for --status-warning-surface-hover."),
  "warning-border": token("color", "{color.amber.800}", "Dark override for --status-warning-border."),
  "info-surface": token("color", "{color.blue.950}", "Dark override for --status-info-surface."),
  "info-surface-hover": token("color", "{color.blue.900}", "Dark override for --status-info-surface-hover."),
  "info-border": token("color", "{color.blue.800}", "Dark override for --status-info-border."),
}
writeJson(["mode", "dark.json"], {
  $description: "Dark-mode semantic overrides, generated from brand.config.json `dark`.",
  mode: { dark: { color: darkColor, status: darkStatus } },
})

/* ---------- 12. semantic/status.json ---------- */
const proposed = (path, why) =>
  token("color", `{${path}}`, why, { "looloo.status": "proposed" })
writeJson(["semantic", "status.json"], {
  $description:
    "Status colors. `destructive` is live (aliases the semantic layer). success/warning/info are PROPOSED v2 additions — not consumed by any component yet; wire up in Phase 4+.",
  status: {
    destructive: token("color", "{color.destructive}", "Alias of the live semantic token."),
    success: proposed("color.green.700", "Design sign-off 2026-07-08: green-700 (green-600 on white was 3.30:1 < AA). Not consumed yet."),
    "success-foreground": proposed("color.white", "Proposed. Not consumed yet."),
    warning: proposed("color.amber.500", "The warning FILL. Consumed by badge (as a 10% tint)."),
    "warning-foreground": proposed("color.neutral.950", "Text ON a solid warning fill."),
    "warning-text": token("color", "{color.amber.700}",
      "Warning as TEXT (on a light/tinted surface). amber.500 is the fill colour and is far too light to read — 2.1:1 on white; amber.700 is 4.6:1. success and info need no such split: green.700 and blue.600 already pass as text."),
    info: proposed("color.blue.600", "Proposed. Not consumed yet."),
    "info-foreground": proposed("color.white", "Proposed. Not consumed yet."),
    // Solid-shade status surfaces (PR #33). Dark shades in mode/dark.json (mode.dark.status).
    "success-surface": token("color", "{color.green.50}", "Success surface (solid tint). Dark: green.950."),
    "success-surface-hover": token("color", "{color.green.100}", "Success surface, hover. Dark: green.900."),
    "success-border": token("color", "{color.green.200}", "Success border. Dark: green.800."),
    "warning-surface": token("color", "{color.amber.50}", "Warning surface (solid tint). Dark: amber.950."),
    "warning-surface-hover": token("color", "{color.amber.100}", "Warning surface, hover. Dark: amber.900."),
    "warning-border": token("color", "{color.amber.200}", "Warning border. Dark: amber.800."),
    "info-surface": token("color", "{color.blue.50}", "Info surface (solid tint). Dark: blue.950."),
    "info-surface-hover": token("color", "{color.blue.100}", "Info surface, hover. Dark: blue.900."),
    "info-border": token("color", "{color.blue.200}", "Info border. Dark: blue.800."),
  },
})

/* ---------- 13. theme/neutral.json (white-label scalars) ---------- */
writeJson(["theme", "neutral.json"], {
  $description:
    "Neutral (white-label) theme scalars from brand.config.json. Brand forks keep overriding brand.config.json until themes/ lands in Phase 3+.",
  theme: {
    neutral: {
      radius: token("dimension", brand.radius ?? "0.625rem", "Base --radius; runtime scale is calc-based in app/globals.css."),
      font: {
        sans: token("fontFamily", brand.fonts?.sans ?? "sans-serif"),
        mono: token("fontFamily", brand.fonts?.mono ?? "monospace"),
      },
      motion: {
        duration: token("duration", axes.duration ?? "200ms"),
        ease: token("cubicBezier", axes.ease ?? "cubic-bezier(0.4, 0, 0.2, 1)"),
      },
      layout: {
        container: token("dimension", axes.container ?? "1280px"),
        section: token("dimension", axes.section ?? "6rem"),
      },
      typography: {
        leading: token("number", axes.leading ?? "1.5", "Body line-height (brand.css re-points --text-base--line-height)."),
        tracking: token("dimension", axes.tracking ?? "0em", "Letter-spacing (brand.css re-points --tracking-tight)."),
        weightHeading: token("fontWeight", axes.weight_heading ?? "600", "Heading weight (--weight-heading)."),
      },
    },
  },
})

console.log("tokens/ canonical layer regenerated from legacy sources:")
console.log(`  primitive palette:        ${Object.keys(primByOklch).length} oklch entries (read from hand-authored color.json)`)
console.log(`  semantic light tokens:    ${Object.keys(semanticColor).length}`)
console.log(`  dark overrides:           ${Object.keys(darkColor).length}`)
