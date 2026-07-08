#!/usr/bin/env node
/**
 * hardcoded-styles.mjs — report-first audit of hardcoded styling in
 * components/ui/ (LOOLOO_DS_V2_REPO_STRUCTURE.md §14.1).
 *
 * Reports (does not fail CI — pass --strict to exit 1 on findings):
 *   HIGH   raw palette classes where semantic tokens exist (bg-white,
 *          text-black, border-gray-*, bg-gray-* …) and literal colors
 *          (#hex, rgb(), oklch()) outside CSS-var plumbing
 *   INFO   count of arbitrary-value utilities ([...]) per file — mostly
 *          legitimate Radix/vendor plumbing; inventory for the
 *          component-tokenization phase
 *
 * Run: npm run audit:styles
 */
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const dir = join(root, "components", "ui")
const strict = process.argv.includes("--strict")

const HIGH = [
  [/\b(?:bg|text|border|ring|fill|stroke)-white\b/, "raw `white` utility"],
  [/\b(?:bg|text|border|ring|fill|stroke)-black\b/, "raw `black` utility"],
  [/\b(?:bg|text|border|ring)-(?:gray|slate|zinc|neutral|stone)-\d+\b/, "raw neutral palette utility"],
  [/#[0-9a-fA-F]{3,8}\b(?![^[]*\])/, "literal hex color"],
  [/\b(?:rgb|oklch|hsl)\((?!in )/, "literal color function"],
]

let high = 0
let files = 0
const arbitrary = []

for (const f of readdirSync(dir).sort()) {
  if (!f.endsWith(".tsx")) continue
  files++
  const lines = readFileSync(join(dir, f), "utf8").split("\n")
  let arb = 0
  lines.forEach((line, i) => {
    // skip attribute-selector plumbing like [&_[stroke='#ccc']] and color-mix vars
    const stripped = line.replace(/\[&[^\]]*\]/g, "").replace(/color-mix\([^)]*\)/g, "")
    for (const [re, label] of HIGH) {
      if (re.test(stripped)) {
        high++
        console.log(`HIGH  ${f}:${i + 1}  ${label}`)
        console.log(`      ${line.trim().slice(0, 120)}`)
      }
    }
    arb += (line.match(/-\[[^\]]+\]/g) ?? []).length
  })
  if (arb) arbitrary.push([f, arb])
}

console.log(`\nINFO  arbitrary-value utilities (inventory, not violations):`)
for (const [f, n] of arbitrary.sort((a, b) => b[1] - a[1]).slice(0, 10))
  console.log(`      ${String(n).padStart(3)}  ${f}`)
console.log(
  `\naudit:styles — ${files} files scanned, ${high} HIGH finding(s), ` +
    `${arbitrary.reduce((s, [, n]) => s + n, 0)} arbitrary values in ${arbitrary.length} files`
)
process.exit(strict && high ? 1 : 0)
