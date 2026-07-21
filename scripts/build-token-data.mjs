#!/usr/bin/env node
/**
 * build-token-data.mjs — generate the primitive color layer (app/primitives.css)
 * from tokens.json (the Figma export), emitted in OKLCH. Semantic tokens in
 * app/brand.css alias into these (var(--tw-*), var(--brand-*), …).
 *
 * (The old showcase outputs — components/showcase/palettes.ts + token-coverage.ts —
 * were removed when the repo became a DS package; this now emits primitives.css only.)
 *
 * Run: node scripts/build-token-data.mjs   (or: npm run tokens:data)
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { toOklch } from "./lib-oklch.mjs"
import { warnDeprecated } from "./_deprecated.mjs"

warnDeprecated({
  script: "tokens:data (scripts/build-token-data.mjs) — generates app/primitives.css from tokens.json",
  replacement: "hand-authored tokens/primitive/** → `npm run tokens:build` (dist/tokens/primitive.css)",
})

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tokens = JSON.parse(readFileSync(join(root, "tokens.json"), "utf8"))

/* ---------- palettes (family → step → hex) ---------- */
function buildPalette(collKey) {
  const coll = tokens[collKey]
  if (!coll) return {}
  const res = {}
  for (const [name, val] of Object.entries(coll)) {
    if (typeof val !== "object" || val === null) continue
    if ("$value" in val && val.$type === "color") {
      res[name] = { "": val.$value } // single (white/black)
      continue
    }
    const steps = {}
    for (const [s, v] of Object.entries(val)) {
      if (v && typeof v === "object" && "$value" in v && v.$type === "color")
        steps[s] = v.$value
    }
    if (Object.keys(steps).length) res[name] = steps
  }
  return res
}

const twColors = buildPalette("tw-colors/Mode 1")
const rdxColors = buildPalette("rdx-colors/light mode")
const brandColors = buildPalette("brand-color/Mode 1")

/* ---------- primitive CSS layer (app/primitives.css), emitted in oklch ---------- */
function paletteVars(prefix, palette) {
  const lines = []
  for (const [fam, steps] of Object.entries(palette)) {
    const f = fam.toLowerCase().replace(/\s+/g, "-")
    for (const [step, hex] of Object.entries(steps)) {
      lines.push(`  --${prefix}-${f}${step ? `-${step}` : ""}: ${toOklch(hex)};`)
    }
  }
  return lines
}
const primitivesCss =
  "/* AUTO-GENERATED primitive color layer from tokens.json by\n" +
  " * scripts/build-token-data.mjs. Do NOT edit. Values are OKLCH (neutral\n" +
  " * ramp snapped to Tailwind v4 canonical). Semantic tokens in app/brand.css\n" +
  " * alias into these (var(--tw-*), var(--brand-*), …). */\n" +
  ":root {\n" +
  [
    "  /* Tailwind palette */",
    ...paletteVars("tw", twColors),
    "\n  /* Radix palette */",
    ...paletteVars("rdx", rdxColors),
    "\n  /* Brand palette */",
    ...paletteVars("brand", brandColors),
  ].join("\n") +
  "\n}\n"
writeFileSync(join(root, "app/primitives.css"), primitivesCss)
console.log("app/primitives.css regenerated from tokens.json")
