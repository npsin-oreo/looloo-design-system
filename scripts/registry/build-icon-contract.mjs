#!/usr/bin/env node
/**
 * build-icon-contract.mjs — emit .designops/icon-contract.json from
 * icons/icon-registry.ts (regex-parses the REGISTRY block; the registry file
 * documents the one-entry-per-line format contract).
 *
 * Run: npm run icons:contract   (also part of the CI drift check)
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
const src = readFileSync(join(root, "icons", "icon-registry.ts"), "utf8")

const block = /export const iconRegistry = \{([\s\S]*?)\} as const/.exec(src)
if (!block) {
  console.error("✖ could not locate the iconRegistry block")
  process.exit(1)
}

const icons = {}
for (const line of block[1].split("\n")) {
  const m = /^\s*(?:"([a-z0-9-]+)"|([a-z0-9-]+)):\s*(\w+),\s*$/.exec(line)
  if (!m) continue
  const name = m[1] ?? m[2]
  icons[name] = {
    source: "lucide-react",
    component: m[3],
    status: "stable",
  }
}

writeFileSync(
  join(root, ".designops", "icon-contract.json"),
  JSON.stringify(
    {
      source_of_truth: "icons/icon-registry.ts",
      default_library: "lucide-react",
      rules: [
        "product code imports Icon/IconButton or registry re-exports — never lucide-react directly",
        "custom SVGs live in icons/custom/ and must be registered",
        "icon-only buttons require aria-label (IconButton enforces this)",
      ],
      icons,
    },
    null,
    2
  ) + "\n"
)
console.log(`.designops/icon-contract.json — ${Object.keys(icons).length} icons`)
