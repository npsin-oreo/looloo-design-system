#!/usr/bin/env node
/**
 * build-brand.mjs — generate brand.css from brand.config.json.
 *
 * The brand layer is the ONLY place a brand fork changes colors/radius.
 *
 * Two ways to run:
 *   • In this repo:  `npm run brand:build`            (CWD = repo root)
 *   • In a consumer: `npx ds-brand-build [config] [out]`
 *       reads ./brand.config.json, writes ./app/brand.css in the CONSUMER's CWD,
 *       using the design system's bundled tokens.json for primitive aliasing.
 *
 *   config (argv[2]) default: <cwd>/brand.config.json
 *   out    (argv[3]) default: <cwd>/app/brand.css
 *
 * Convenience: if a base color (e.g. `primary`) is set but its
 * `*-foreground` is omitted, a readable foreground is auto-derived by
 * luminance — so a minimal config (just `primary`) still produces a full,
 * accessible pair.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"
import { toOklch } from "./lib-oklch.mjs"

// Package root (where this script lives) — source of the bundled tokens.json.
const root = join(dirname(fileURLToPath(import.meta.url)), "..")
// CWD-relative config + output, so a consumer themes their own app without
// forking. In this repo the CWD IS the package root, so paths are unchanged.
const configPath = resolve(process.argv[2] || join(process.cwd(), "brand.config.json"))
const outPath = resolve(process.argv[3] || join(process.cwd(), "app", "brand.css"))

/**
 * Accept BOTH brand.config.json shapes:
 *   • nested (DS-fork)      — { name, light:{...}, dark:{...}, fonts:{sans} }
 *   • flat   (consumer/DesignOps Step 2.6) — { project_name, primary, background,
 *                              foreground, radius, font_sans, ... }
 * Flat color keys are lifted into `light` so a SINGLE file themes both ways:
 * forking this repo (brand:build) and CSS-var override in a package consumer.
 * `light`/`dark`/`fonts` set explicitly always win over the lifted/aliased forms.
 */
// Non-colour axis keys — recognized at top level (flat) or under `axes` (grouped),
// so they are NOT mistaken for colours and lifted into `light` (toOklch would throw).
const AXIS_KEYS = ["ease", "duration", "leading", "tracking", "weight_heading", "container", "section"]

function normalizeBrandConfig(raw) {
  const RESERVED = new Set([
    "$schema", "name", "project_name", "description",
    "radius", "fonts", "font_sans", "font_mono", "light", "dark",
    "axes", ...AXIS_KEYS,
  ])
  const cfg = { ...raw }
  if (!cfg.name && cfg.project_name) cfg.name = cfg.project_name
  if (cfg.font_sans || cfg.font_mono) {
    cfg.fonts = { ...(cfg.fonts ?? {}) }
    if (cfg.font_sans && !cfg.fonts.sans) cfg.fonts.sans = cfg.font_sans
    if (cfg.font_mono && !cfg.fonts.mono) cfg.fonts.mono = cfg.font_mono
  }
  // axes accept BOTH shapes: grouped { axes: {...} } and flat top-level keys.
  const axes = { ...(raw.axes ?? {}) }
  for (const k of AXIS_KEYS) if (raw[k] != null && axes[k] == null) axes[k] = raw[k]
  if (Object.keys(axes).length) cfg.axes = axes
  const lifted = {}
  for (const [k, v] of Object.entries(raw)) {
    if (!RESERVED.has(k)) lifted[k] = v
  }
  if (Object.keys(lifted).length) cfg.light = { ...lifted, ...(cfg.light ?? {}) }
  return cfg
}

const config = normalizeBrandConfig(JSON.parse(readFileSync(configPath, "utf8")))
// Bundled with the package. If absent, skip primitive aliasing (emit literal oklch).
let tokens = {}
try {
  tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))
} catch {
  tokens = {}
}

// oklch → primitive CSS-var name, so semantics can alias to the primitive layer
// (app/primitives.css, itself emitted in oklch). First palette wins for shared
// colors (tw > rdx > brand). Keyed by the converted oklch string so brand.config
// values (also oklch) match the same canonical form.
function buildPrimMap() {
  const map = {}
  const add = (prefix, collKey) => {
    const coll = tokens[collKey]
    if (!coll) return
    for (const [fam, steps] of Object.entries(coll)) {
      if (!steps || typeof steps !== "object") continue
      const f = fam.toLowerCase().replace(/\s+/g, "-")
      if ("$value" in steps && steps.$type === "color") {
        const ok = toOklch(steps.$value)
        if (!(ok in map)) map[ok] = `${prefix}-${f}`
        continue
      }
      for (const [step, v] of Object.entries(steps)) {
        if (v && v.$value && v.$type === "color") {
          const ok = toOklch(v.$value)
          if (!(ok in map)) map[ok] = `${prefix}-${f}-${step}`
        }
      }
    }
  }
  add("tw", "tw-colors/Mode 1")
  add("rdx", "rdx-colors/light mode")
  add("brand", "brand-color/Mode 1")
  return map
}
const PRIM = buildPrimMap()

/**
 * Normalize a color to oklch, then alias it to its primitive var if one matches.
 * Returns { value, raw }: `value` is what to emit (a `var(--…)` alias or the
 * literal oklch), `raw` is the resolved oklch for an explanatory comment.
 */
function aliased(value) {
  const ok = toOklch(value)
  const prim = PRIM[ok]
  return prim ? { value: `var(--${prim})`, raw: ok } : { value: ok, raw: ok }
}

// Pairs where a missing `-foreground` is auto-derived from the base color.
const PAIRS = [
  "primary",
  "secondary",
  "accent",
  "card",
  "popover",
  "muted",
  "sidebar",
  "sidebar-primary",
  "sidebar-accent",
]

const DARK = "oklch(0.145 0 0)"
const LIGHT = "oklch(0.985 0 0)"

/** OKLCH lightness (0–1) of any supported color, else null. */
function lightness(value) {
  const m = /^oklch\(\s*([\d.]+)/.exec(toOklch(value))
  return m ? parseFloat(m[1]) : null
}

/** Pick a readable foreground for a base color, by perceptual lightness. */
function contrast(value) {
  const l = lightness(value)
  if (l === null) return LIGHT
  return l > 0.6 ? DARK : LIGHT
}

function emit(mode) {
  const tokens = { ...(config[mode] ?? {}) }
  // Auto-derive missing foregrounds.
  for (const base of PAIRS) {
    const fg = `${base}-foreground`
    if (tokens[base] && !tokens[fg]) tokens[fg] = contrast(tokens[base])
  }
  const lines = Object.entries(tokens).map(([k, v]) => {
    const { value, raw } = aliased(v)
    const note = value !== raw ? ` /* ${raw} */` : ""
    return `  --${k}: ${value};${note}`
  })
  return lines.join("\n")
}

// Axis tokens that re-point a Tailwind theme token (so existing utilities inherit them) → @theme.
const AXIS_THEME = { leading: "--text-base--line-height", tracking: "--tracking-tight" }
// Axis tokens with no Tailwind equivalent → plain :root CSS vars (applied via [data-slot]/utilities).
const AXIS_ROOT = {
  ease: "--ease-brand",
  duration: "--duration-base",
  weight_heading: "--weight-heading",
  container: "--container-max",
  section: "--space-section",
}

/** `@theme { … }` block re-pointing Tailwind ramp tokens; empty string when no such axes set. */
function emitAxesTheme() {
  const a = config.axes ?? {}
  const lines = Object.entries(AXIS_THEME)
    .filter(([k]) => a[k] != null)
    .map(([k, varName]) => `  ${varName}: ${a[k]};`)
  return lines.length ? `@theme {\n${lines.join("\n")}\n}\n\n` : ""
}

/** `:root` axis CSS vars (ease/duration/weight/container/section); "" when none set. */
function emitAxesRoot() {
  const a = config.axes ?? {}
  const lines = Object.entries(AXIS_ROOT)
    .filter(([k]) => a[k] != null)
    .map(([k, varName]) => `  ${varName}: ${a[k]};`)
  return lines.length ? lines.join("\n") + "\n" : ""
}

const css = `/* ----------------------------------------------------------------------------
 * brand.css — AUTO-GENERATED from brand.config.json by scripts/build-brand.mjs.
 * Do NOT edit by hand. Edit brand.config.json then run \`npm run brand:build\`.
 *
 * This is the BRAND LAYER. A per-brand fork edits brand.config.json only;
 * everything else (component structure, spacing/radius/type scales, shadows,
 * docs) stays inherited from the white-label base.
 *
 * Brand: ${config.name}
 * -------------------------------------------------------------------------- */

${emitAxesTheme()}:root {
  --radius: ${config.radius ?? "0.5rem"};
${emitAxesRoot()}${emit("light")}
}

.dark {
${emit("dark")}
}
`

writeFileSync(outPath, css)
console.log(
  `✓ ${outPath} generated for "${config.name}" (${Object.keys(config.light ?? {}).length} light tokens)`
)
