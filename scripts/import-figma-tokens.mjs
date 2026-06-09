#!/usr/bin/env node
/**
 * import-figma-tokens.mjs — sync brand.config.json from a Figma DTCG export.
 *
 * Reads tokens.json (default: ./tokens.json, or pass a path arg), resolves the
 * `shadcn-ui/Mode 1` semantic tokens (aliases → hex via tw-colors / rdx-colors),
 * normalizes the kit's Figma typos, and writes the result into
 * brand.config.json `light`. Other config (name, radius, fonts, dark, and the
 * non-exported extras) is preserved.
 *
 * Run:  npm run tokens:import [path/to/tokens.json]
 * Then: npm run brand:build
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, resolve } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const tokensPath = resolve(root, process.argv[2] ?? "tokens.json")
const configPath = join(root, "brand.config.json")

const tokens = JSON.parse(readFileSync(tokensPath, "utf8"))
const config = JSON.parse(readFileSync(configPath, "utf8"))

const tw = tokens["tw-colors/Mode 1"] ?? {}
const rdx = tokens["rdx-colors/light mode"] ?? {}
const semantic = tokens["shadcn-ui/Mode 1"]
if (!semantic) {
  console.error(`✗ "shadcn-ui/Mode 1" token set not found in ${tokensPath}`)
  process.exit(1)
}

/** Resolve a DTCG $value (alias like {neutral.900}, {white}, or raw hex). */
function resolveValue(value, seen = new Set()) {
  if (typeof value !== "string") return null
  const v = value.trim()
  if (!v.startsWith("{")) return v // already a literal color
  const ref = v.slice(1, -1)
  if (seen.has(ref)) return null
  seen.add(ref)
  if (ref === "white" || ref === "black") {
    return resolveValue(tw[ref]?.$value, seen)
  }
  const [fam, step] = ref.split(".")
  const node = tw[fam]?.[step] ?? rdx[fam]?.[step]
  return node ? resolveValue(node.$value, seen) : null
}

// Figma kit typo → correct CSS-variable name.
const RENAME = {
  backgrund: "background",
  "Card": "card",
  "Card-foregrund": "card-foreground",
  "popover-foregrund": "popover-foreground",
  "primary-foregrund": "primary-foreground",
  "secondary-foregrund": "secondary-foreground",
  "muted-foregrund": "muted-foreground",
  "accent-foregrund": "accent-foreground",
  "sidebar-foregrund": "sidebar-foreground",
  "sidebar-primary-foregrund": "sidebar-primary-foreground",
  "sidebar-accent-foregrund": "sidebar-accent-foreground",
}

const resolved = {}
const unresolved = []
for (const [rawName, def] of Object.entries(semantic)) {
  if (!def || def.$type !== "color") continue
  const name = RENAME[rawName] ?? rawName
  const hex = resolveValue(def.$value)
  if (hex) resolved[name] = hex.toLowerCase()
  else unresolved.push(rawName)
}

// Merge into light (override exported tokens, keep extras like semantic-*).
const before = JSON.stringify(config.light)
config.light = { ...config.light, ...resolved }
const changed = JSON.stringify(config.light) !== before

writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n")

console.log(
  `✓ imported ${Object.keys(resolved).length} semantic tokens from ${process.argv[2] ?? "tokens.json"} → brand.config.json (light)`
)
if (unresolved.length) console.warn(`  ⚠ unresolved: ${unresolved.join(", ")}`)
console.log(
  changed
    ? "  brand.config.json light changed — run `npm run brand:build`."
    : "  no changes (already in sync)."
)
