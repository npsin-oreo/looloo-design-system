#!/usr/bin/env node
/**
 * build-brand.mjs — generate app/brand.css from brand.config.json.
 *
 * The brand layer is the ONLY place a brand fork changes colors/radius.
 * Run: `npm run brand:build`
 *
 * Convenience: if a base color (e.g. `primary`) is set but its
 * `*-foreground` is omitted, a readable foreground is auto-derived by
 * luminance — so a minimal config (just `primary`) still produces a full,
 * accessible pair.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toOklch } from "./lib-oklch.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const config = JSON.parse(readFileSync(join(root, "brand.config.json"), "utf8"))
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))

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

:root {
  --radius: ${config.radius ?? "0.5rem"};
${emit("light")}
}

.dark {
${emit("dark")}
}
`

writeFileSync(join(root, "app", "brand.css"), css)
console.log(
  `✓ app/brand.css generated for "${config.name}" (${Object.keys(config.light ?? {}).length} light tokens)`
)
