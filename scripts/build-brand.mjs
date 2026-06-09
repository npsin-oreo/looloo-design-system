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

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const config = JSON.parse(readFileSync(join(root, "brand.config.json"), "utf8"))
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))

// hex → primitive CSS-var name, so semantics can alias to the primitive layer
// (app/primitives.css). First palette wins for shared hexes (tw > rdx > brand).
function buildPrimMap() {
  const map = {}
  const add = (prefix, collKey) => {
    const coll = tokens[collKey]
    if (!coll) return
    for (const [fam, steps] of Object.entries(coll)) {
      if (!steps || typeof steps !== "object") continue
      const f = fam.toLowerCase().replace(/\s+/g, "-")
      if ("$value" in steps && steps.$type === "color") {
        const hex = String(steps.$value).toLowerCase()
        if (!(hex in map)) map[hex] = `${prefix}-${f}`
        continue
      }
      for (const [step, v] of Object.entries(steps)) {
        if (v && v.$value && v.$type === "color") {
          const hex = String(v.$value).toLowerCase()
          if (!(hex in map)) map[hex] = `${prefix}-${f}-${step}`
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

/** Alias a color to its primitive var if it matches one, else keep the value. */
function aliased(value) {
  const prim = PRIM[String(value).toLowerCase()]
  return prim ? `var(--${prim})` : value
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

const DARK = "#0a0a0a"
const LIGHT = "#fafafa"

/** Relative luminance (0–1) of a #rgb / #rrggbb color, else null. */
function luminance(hex) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex?.trim() ?? "")
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Pick a readable foreground for a base color. */
function contrast(hex) {
  const l = luminance(hex)
  if (l === null) return LIGHT
  return l > 0.45 ? DARK : LIGHT
}

function emit(mode) {
  const tokens = { ...(config[mode] ?? {}) }
  // Auto-derive missing foregrounds.
  for (const base of PAIRS) {
    const fg = `${base}-foreground`
    if (tokens[base] && !tokens[fg]) tokens[fg] = contrast(tokens[base])
  }
  const lines = Object.entries(tokens).map(([k, v]) => {
    const alias = aliased(v)
    const note = alias !== v ? ` /* ${v} */` : ""
    return `  --${k}: ${alias};${note}`
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
