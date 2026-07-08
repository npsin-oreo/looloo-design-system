#!/usr/bin/env node
/**
 * icon-usage.mjs — report-first icon audit (LOOLOO_DS_V2_REPO_STRUCTURE.md §14.3).
 *
 * Detects:
 *   HIGH  import from "lucide-react" outside the registry + allowlist
 *   HIGH  inline <svg> in components (custom icons must be registered)
 *   WARN  icon-only Button usage (size="icon…") without aria-label nearby
 *         (heuristic, same-tag scan; <IconButton> makes the label required
 *         structurally — prefer it)
 *
 * Exits 0 (report-only) unless --strict.  Run: npm run audit:icons
 */
import { readFileSync, readdirSync, statSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join, relative } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const strict = process.argv.includes("--strict")

// The sanctioned direct-lucide surface:
const ALLOWLIST = new Set([
  "icons/icon-registry.ts",
  "components/docs/references/icon-library.tsx", // docs gallery renders ALL lucide icons
])

function walk(d) {
  const out = []
  for (const f of readdirSync(d).sort()) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (/\.(tsx|ts)$/.test(f)) out.push(p)
  }
  return out
}

let high = 0
let warn = 0
const scanDirs = ["components", "stories", "icons", "app"].map((d) => join(root, d))
for (const dir of scanDirs) {
  for (const p of walk(dir)) {
    const rel = relative(root, p)
    if (ALLOWLIST.has(rel)) continue
    const src = readFileSync(p, "utf8")
    if (src.startsWith("// compat re-export")) continue
    if (/from\s+"lucide-react"/.test(src)) {
      high++
      console.log(`HIGH  ${rel}: direct lucide-react import — use @/icons/icon-registry`)
    }
    if (/<svg[\s>]/.test(src) && !rel.startsWith("icons/custom/")) {
      high++
      console.log(`HIGH  ${rel}: inline <svg> — register it in icons/ instead`)
    }
    // heuristic: icon-only button without an accessible name in the same tag
    for (const m of src.matchAll(/<Button[^>]*size="icon[^"]*"[^>]*>/g)) {
      if (!/aria-label|aria-labelledby/.test(m[0])) {
        warn++
        console.log(`WARN  ${rel}: size="icon…" Button without aria-label in tag (check for sr-only text or use <IconButton>)`)
      }
    }
  }
}
console.log(
  `\naudit:icons — ${high} HIGH, ${warn} WARN${strict ? "" : " (report-only; --strict to gate)"}`
)
process.exit(strict && high ? 1 : 0)
