#!/usr/bin/env node
/**
 * build-contract.mjs — emit .designops/token-contract.json, the v2 machine
 * contract: every canonical token with type, resolved value, css var, layer,
 * source file, alias, mode/theme availability, and proposed/deprecated flags.
 *
 * The ROOT token-contract.json (brand-config keys, CI-checked, published in
 * the npm package) is the LEGACY contract of record and is not touched.
 *
 * Deterministic output (sorted, no timestamps) so it can be committed and
 * drift-checked like the other generated files.
 *
 * Run: npm run tokens:build
 */
import { writeFileSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { loadTokens, resolveValue, aliasOf, repoRoot } from "./lib-tokens.mjs"

const { registry, overlays } = loadTokens()
const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"))

// path → which modes/themes override it
const overriddenBy = { mode: {}, theme: {} }
for (const kind of ["mode", "theme"]) {
  for (const [name, overlay] of Object.entries(overlays[kind])) {
    for (const { path } of overlay.entries) {
      if (!registry.has(path)) continue
      ;(overriddenBy[kind][path] ??= []).push(name)
    }
  }
}

const tokens = {}
for (const e of [...registry.values()].sort((a, b) => a.path.localeCompare(b.path))) {
  const t = e.token
  const entry = {
    type: t.$type ?? "unknown",
    value: resolveValue(registry, t.$value),
    cssVar: e.cssVar,
    layer: e.layer,
    source: `tokens/${e.file}`,
  }
  const alias = aliasOf(t.$value)
  if (alias) entry.alias = alias
  if (t.$description) entry.description = t.$description
  if (t.$deprecated) entry.deprecated = t.$deprecated
  if (t.$extensions?.["looloo.status"] === "proposed") entry.status = "proposed"
  if (overriddenBy.mode[e.path]) entry.modes = overriddenBy.mode[e.path].sort()
  if (overriddenBy.theme[e.path]) entry.themes = overriddenBy.theme[e.path].sort()
  tokens[e.path] = entry
}

const contract = {
  package: pkg.name,
  version: pkg.version,
  generated_from: "tokens/** (canonical v2 layer)",
  note: "v2 contract. The root token-contract.json remains the legacy/published brand-config contract until the consumer swap.",
  counts: {
    primitive: [...registry.values()].filter((e) => e.layer === "primitive").length,
    semantic: [...registry.values()].filter((e) => e.layer === "semantic").length,
    component: [...registry.values()].filter((e) => e.layer === "component").length,
    modes: Object.keys(overlays.mode).sort(),
    themes: Object.keys(overlays.theme).sort(),
  },
  tokens,
}

writeFileSync(
  join(repoRoot, ".designops", "token-contract.json"),
  JSON.stringify(contract, null, 2) + "\n"
)
console.log(`.designops/token-contract.json — ${Object.keys(tokens).length} tokens`)
