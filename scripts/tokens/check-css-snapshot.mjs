#!/usr/bin/env node
/** Phase 4 byte-identity gate (RFC retire-legacy-token-pipeline): the resolved published CSS
 * must not change while the token SOURCE is refactored generated→hand-authored. Rebuilds and
 * byte-compares dist/tokens/{primitive,semantic,component}.css against the committed golden
 * snapshot in .designops/css-snapshot/. Update the snapshot ONLY on an intended output change. */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..")
let bad = 0
const files = [["primitive","primitive"],["semantic","semantic"],["component","component"],["modes/dark","modes-dark"]]
for (const [rel, gold] of files) {
  const cur = readFileSync(join(root, "dist/tokens", `${rel}.css`), "utf8")
  const goldTxt = readFileSync(join(root, ".designops/css-snapshot", `${gold}.css`), "utf8")
  if (cur !== goldTxt) { console.error(`✗ ${rel}.css differs from golden snapshot`); bad++ }
  else console.log(`✓ ${rel}.css byte-identical`)
}
if (bad) { console.error("::error::CSS output drift — if intended, refresh .designops/css-snapshot/"); process.exit(1) }
console.log("css-snapshot — published CSS byte-identical")
