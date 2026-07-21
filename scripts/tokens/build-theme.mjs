#!/usr/bin/env node
/**
 * build-theme.mjs — Phase 4 (RFC retire-legacy-token-pipeline).
 *
 * Generates the theme-tier overlays `tokens/theme/<brand>.json` from brand config(s).
 * A brand is a single-file config: the default (neutral / white-label) is the root
 * `brand.config.json`; every additional brand forks its own `brands/<name>.config.json`.
 * The overlay carries the brand's tunable VALUES (radius base, fonts, motion, layout, type
 * axes, and the shadcn colour roles → primitive aliases); semantic/primitive stay brand-agnostic.
 *
 * Usage: node scripts/tokens/build-theme.mjs            # ALL brands: neutral + every brands/*.config.json
 *        node scripts/tokens/build-theme.mjs --name X   # just brand X
 * Deterministic — CI drift gate re-runs it and diffs tokens/theme/.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toOklch } from "../lib-oklch.mjs"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const token = (type, value, description) => {
  const t = { $type: type, $value: value }
  if (description) t.$description = description
  return t
}

// oklch → primitive path, from the hand-authored palette (first-wins), so theme.color.* aliases
// the SAME primitive path the semantic tier used to alias directly.
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
const colorFrom = (roles) => {
  const out = {}
  for (const [k, v] of Object.entries(roles ?? {})) {
    const ok = toOklch(v)
    const path = primByOklch[ok]
    out[k] = path ? token("color", `{${path}}`) : token("color", ok)
  }
  return out
}

function buildOverlay(name, brandFile) {
  const brand = JSON.parse(readFileSync(brandFile, "utf8"))
  const axes = brand.axes ?? {}
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
    // shadcn colour roles → primitive aliases. Semantic references {theme.color.*}; build-css
    // chain-skips the theme tier so --primary still emits var(--ll-color-*).
    color: colorFrom(brand.light),
    colorDark: colorFrom(brand.dark),
  }
  writeFileSync(
    join(root, "tokens", "theme", `${name}.json`),
    JSON.stringify(
      {
        $description:
          `Theme-tier overlay for "${name}" — the brand's tunable scalars + shadcn colour roles. Generated from ${brandFile.includes("brands/") ? `brands/${name}.config.json` : "brand.config.json"} by scripts/tokens/build-theme.mjs (Phase 4).`,
        theme: { [name]: overlay },
      },
      null,
      2,
    ) + "\n",
  )
  console.log(`tokens/theme/${name}.json ← ${brandFile.includes("brands/") ? `brands/${name}.config.json` : "brand.config.json"}`)
}

// targets
const nameArg = process.argv.indexOf("--name")
const targets = []
if (nameArg > -1) {
  const n = process.argv[nameArg + 1]
  targets.push([n, existsSync(join(root, "brands", `${n}.config.json`)) ? join(root, "brands", `${n}.config.json`) : join(root, "brand.config.json")])
} else {
  targets.push(["neutral", join(root, "brand.config.json")])
  if (existsSync(join(root, "brands")))
    for (const f of readdirSync(join(root, "brands")).sort())
      if (f.endsWith(".config.json")) targets.push([f.replace(/\.config\.json$/, ""), join(root, "brands", f)])
}
for (const [n, file] of targets) buildOverlay(n, file)
