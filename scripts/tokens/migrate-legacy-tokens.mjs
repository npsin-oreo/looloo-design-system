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
const writeJson = (path, obj) =>
  writeFileSync(out(...path), JSON.stringify(obj, null, 2) + "\n")

/* ---------- 1. primitive/color.json ---------- */
// oklch string → canonical token path, used later to alias semantic tokens.
const primByOklch = {}
function palette(collKey, pathPrefix, sourceLabel, target) {
  for (const [fam, steps] of Object.entries(legacy[collKey] ?? {})) {
    if (!steps || typeof steps !== "object") continue
    const f = fam.toLowerCase().replace(/\s+/g, "-")
    const put = (node, step) => {
      if (!(node && typeof node === "object" && node.$type === "color")) return
      const ok = toOklch(node.$value)
      const path = `color.${pathPrefix}${f}${step ? `.${step}` : ""}`
      if (!(ok in primByOklch)) primByOklch[ok] = path
      const dest = step
        ? ((target[f] ??= {}), target[f])
        : target
      dest[step || f] = token("color", ok, undefined, {
        "looloo.source": `${sourceLabel}.${fam}${step ? `.${step}` : ""}`,
        "looloo.legacy": node.$value,
      })
    }
    if ("$value" in steps) put(steps, "") // single color (white/black)
    else for (const [step, node] of Object.entries(steps)) put(node, step)
  }
}
const color = {}
palette("tw-colors/Mode 1", "", "tw-colors/Mode 1", color)
const brandColor = {}
palette("brand-color/Mode 1", "brand.", "brand-color/Mode 1", brandColor)
if (Object.keys(brandColor).length) color.brand = brandColor
writeJson(["primitive", "color.json"], {
  $description:
    "Canonical primitive palette (OKLCH). Generated from tokens/raw/legacy.tokens.json by scripts/tokens/migrate-legacy-tokens.mjs — do not hand-edit. Tailwind families are canonical; the Radix palette was not promoted (no consumers) and remains in raw only.",
  color,
})

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
    "Static Figma-kit step. NOTE: the runtime radius scale is currently calc(var(--radius) * n) in app/globals.css; that stays authoritative until Phase 2.",
    { "looloo.legacy": v.$value })
}
writeJson(["primitive", "radius.json"], {
  $description: "Canonical radius steps from the Figma kit. Generated; do not hand-edit.",
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
writeJson(["primitive", "sizing.json"], {
  $description:
    "Control sizing steps measured from the ACTUAL radix-nova cva variants in components/ui/button.tsx + input.tsx (default/md = h-8). Basis for Phase 4 component tokens and density modes.",
  size: {
    control: {
      xs: token("dimension", "1.5rem", "h-6 — button size xs / icon-xs."),
      sm: token("dimension", "1.75rem", "h-7 — button size sm, input size sm."),
      md: token("dimension", "2rem", "h-8 — button/input DEFAULT, select trigger, tabs list."),
      lg: token("dimension", "2.25rem", "h-9 — button size lg."),
      xl: token("dimension", "2.5rem", "h-10 — button/input size xl, table header row."),
    },
  },
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
function semanticValue(v) {
  const ok = toOklch(v)
  const path = primByOklch[ok]
  return path
    ? token("color", `{${path}}`, undefined, { "looloo.resolved": ok })
    : token("color", ok, undefined, { "looloo.legacy": String(v) })
}
const semanticColor = {}
for (const [k, v] of Object.entries(brand.light ?? {})) semanticColor[k] = semanticValue(v)
writeJson(["semantic", "color.json"], {
  $description:
    "Semantic color layer (light) generated from tokens/raw/legacy.brand.config.json. Keys stay flat kebab-case to map 1:1 onto the existing CSS custom properties (--primary, --primary-foreground, …). brand.config.json remains the brand-override input; regenerate after brand changes.",
  color: semanticColor,
})
const darkColor = {}
for (const [k, v] of Object.entries(brand.dark ?? {})) darkColor[k] = semanticValue(v)
writeJson(["mode", "dark.json"], {
  $description: "Dark-mode semantic overrides, generated from brand.config.json `dark`.",
  mode: { dark: { color: darkColor } },
})

/* ---------- 12. semantic/status.json ---------- */
const proposed = (path, why) =>
  token("color", `{${path}}`, why, { "looloo.status": "proposed" })
writeJson(["semantic", "status.json"], {
  $description:
    "Status colors. `destructive` is live (aliases the semantic layer). success/warning/info are PROPOSED v2 additions — not consumed by any component yet; wire up in Phase 4+.",
  status: {
    destructive: token("color", "{color.destructive}", "Alias of the live semantic token."),
    success: proposed("color.green.600", "Proposed. Not consumed yet."),
    "success-foreground": proposed("color.white", "Proposed. Not consumed yet."),
    warning: proposed("color.amber.500", "Proposed. Not consumed yet."),
    "warning-foreground": proposed("color.neutral.950", "Proposed. Not consumed yet."),
    info: proposed("color.blue.600", "Proposed. Not consumed yet."),
    "info-foreground": proposed("color.white", "Proposed. Not consumed yet."),
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
    },
  },
})

console.log("tokens/ canonical layer regenerated from legacy sources:")
console.log(`  primitive color families: ${Object.keys(color).length} (+ brand: ${Object.keys(brandColor).length})`)
console.log(`  semantic light tokens:    ${Object.keys(semanticColor).length}`)
console.log(`  dark overrides:           ${Object.keys(darkColor).length}`)
