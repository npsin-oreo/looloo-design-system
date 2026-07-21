#!/usr/bin/env node
/**
 * build-theme.mjs — Phase 4 (RFC retire-legacy-token-pipeline).
 *
 * Generates the theme-tier overlay `tokens/theme/<brand>.json` from `brand.config.json`.
 * This is the ONE narrow brand.config → theme mapping (radius base, fonts, motion, layout,
 * type axes) — it replaces the theme-generation that used to live in migrate-legacy-tokens.mjs.
 * The overlay is where a brand's tunable VALUES live; the semantic/primitive tiers stay
 * brand-agnostic and reference these (or, today, build-css resolves theme.<brand> into the
 * axis vars). Deterministic: re-running reproduces the file byte-for-byte (CI drift gate).
 *
 * Usage: node scripts/tokens/build-theme.mjs            # default brand = neutral (from brand.config.json)
 *        node scripts/tokens/build-theme.mjs --name X   # write tokens/theme/X.json instead
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toOklch } from "../lib-oklch.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const nameArg = process.argv.indexOf("--name")
const name = nameArg > -1 ? process.argv[nameArg + 1] : "neutral"

const brand = JSON.parse(readFileSync(join(root, "brand.config.json"), "utf8"))
const axes = brand.axes ?? {}

const token = (type, value, description) => {
  const t = { $type: type, $value: value }
  if (description) t.$description = description
  return t
}

// oklch → primitive path, read from the hand-authored palette (same order/first-wins as migrate,
// so theme.color.* aliases the SAME primitive path the semantic tier used to alias directly).
const primByOklch = {}
{
  const tree = JSON.parse(readFileSync(join(root, "tokens", "primitive", "color.json"), "utf8")).color
  const walk = (node, path) => {
    if (node && typeof node === "object" && node.$type === "color" && "$value" in node) {
      const ok = toOklch(node.$value)
      if (!(ok in primByOklch)) primByOklch[ok] = path
      return
    }
    if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) if (!k.startsWith("$")) walk(v, `${path}.${k}`)
  }
  for (const [k, v] of Object.entries(tree)) if (!k.startsWith("$")) walk(v, `color.${k}`)
}
// brand.config colour role → theme.color.<role>, aliased to a primitive when the OKLCH matches.
const colorFrom = (roles) => {
  const out = {}
  for (const [k, v] of Object.entries(roles ?? {})) {
    const ok = toOklch(v)
    const path = primByOklch[ok]
    out[k] = path ? token("color", `{${path}}`) : token("color", ok)
  }
  return out
}

const overlay = {
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
  // The brand's colour roles (shadcn contract). Semantic tokens reference {theme.color.*};
  // build-css chain-skips the theme tier so --primary still emits var(--ll-color-*).
  color: colorFrom(brand.light),
  colorDark: colorFrom(brand.dark),
}

writeFileSync(
  join(root, "tokens", "theme", `${name}.json`),
  JSON.stringify(
    {
      $description:
        `Theme-tier overlay for "${name}" — the brand's tunable scalars (radius base, fonts, motion, layout, type axes). Generated from brand.config.json by scripts/tokens/build-theme.mjs (Phase 4). Semantic/primitive tiers stay brand-agnostic; this overlay carries the brand values.`,
      theme: { [name]: overlay },
    },
    null,
    2,
  ) + "\n",
)

console.log(`tokens/theme/${name}.json ← brand.config.json (radius/font/motion/layout/type axes)`)
