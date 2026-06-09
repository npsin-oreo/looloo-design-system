#!/usr/bin/env node
/**
 * build-token-data.mjs — generate showcase data from tokens.json so the
 * Foundations pages mirror the Figma export with NOTHING hidden:
 *   - components/showcase/palettes.ts    (tw-colors, rdx-colors, brand-color)
 *   - components/showcase/token-coverage.ts (every collection + its distinct values)
 *
 * Run: node scripts/build-token-data.mjs   (or: npm run tokens:data)
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

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

const palettesTs =
  "// AUTO-GENERATED from tokens.json by scripts/build-token-data.mjs. Do not edit.\n" +
  "export const twColors: Record<string, Record<string, string>> = " +
  JSON.stringify(twColors, null, 2) +
  "\n\nexport const rdxColors: Record<string, Record<string, string>> = " +
  JSON.stringify(rdxColors, null, 2) +
  "\n\nexport const brandColors: Record<string, Record<string, string>> = " +
  JSON.stringify(brandColors, null, 2) +
  "\n"
writeFileSync(join(root, "components/showcase/palettes.ts"), palettesTs)

/* ---------- coverage (every collection: count + distinct RESOLVED values) ---------- */
// Global name→value map so DTCG aliases ({4}, {neutral.900}) can be resolved.
const GLOBAL = {}
function indexLeaves(o, path = []) {
  for (const k in o) {
    if (k.startsWith("$")) continue
    const v = o[k]
    if (v && typeof v === "object") {
      if ("$value" in v) GLOBAL[[...path, k].join(".")] = v.$value
      else indexLeaves(v, [...path, k])
    }
  }
}
for (const key of Object.keys(tokens)) {
  if (key.startsWith("$")) continue
  indexLeaves(tokens[key]) // index by path WITHOUT the collection-name prefix
}
function resolve(val, seen = new Set()) {
  const s = String(val).trim()
  if (!s.startsWith("{")) return s
  const ref = s.slice(1, -1)
  if (seen.has(ref) || !(ref in GLOBAL)) return s
  seen.add(ref)
  return resolve(GLOBAL[ref], seen)
}

function leaves(o, out = []) {
  for (const k in o) {
    if (k.startsWith("$")) continue
    const v = o[k]
    if (v && typeof v === "object") {
      if ("$value" in v) out.push(v)
      else leaves(v, out)
    }
  }
  return out
}

const coverage = []
for (const key of Object.keys(tokens)) {
  if (key.startsWith("$")) continue
  const ls = leaves(tokens[key]).map((l) => resolve(l.$value))
  const isColor = ls.length > 0 && ls.every((l) => /^#|rgb|hsl/i.test(String(l)))
  const distinct = [...new Set(ls.map((l) => String(l)))]
  distinct.sort((a, b) => {
    const na = parseFloat(a), nb = parseFloat(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    return a.localeCompare(b)
  })
  coverage.push({
    name: key.replace(/\/.*/, ""),
    count: ls.length,
    kind: isColor ? "color" : "scale",
    values: isColor ? [] : distinct,
  })
}

const coverageTs =
  "// AUTO-GENERATED from tokens.json by scripts/build-token-data.mjs. Do not edit.\n" +
  "export type CoverageEntry = { name: string; count: number; kind: \"color\" | \"scale\"; values: string[] }\n\n" +
  "export const TOKEN_COVERAGE: CoverageEntry[] = " +
  JSON.stringify(coverage, null, 2) +
  "\n"
writeFileSync(join(root, "components/showcase/token-coverage.ts"), coverageTs)

const totalVars = coverage.reduce((n, c) => n + c.count, 0)
console.log(
  `✓ palettes.ts (tw ${Object.keys(twColors).length} · rdx ${Object.keys(rdxColors).length} · brand ${Object.keys(brandColors).length} families)`
)
console.log(
  `✓ token-coverage.ts (${coverage.length} collections, ${totalVars} variables)`
)
