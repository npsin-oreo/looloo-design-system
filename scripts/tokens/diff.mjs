#!/usr/bin/env node
/**
 * diff.mjs — THE parity gate. Proves the generated dist/tokens/*.css resolves
 * to exactly the same values as the legacy committed CSS:
 *
 *   app/primitives.css  vs  dist/tokens/{primitive,compat}.css
 *   app/brand.css :root vs  dist/tokens/semantic.css (+ axes)
 *   app/brand.css .dark vs  dist/tokens/modes/dark.css
 *   app/brand.css @theme vs dist/tokens/semantic.css @theme
 *
 * Every custom property the legacy layer defines must exist on the dist side
 * under the SAME public name and resolve (following var() chains) to the SAME
 * literal value. Extra dist-only vars (--ll-*, --surface-*, --button-*) are
 * additive and reported as info only.
 *
 * Run: npm run tokens:diff   — exits 1 on any mismatch. No swap before green.
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { repoRoot } from "./lib-tokens.mjs"

const read = (...p) => readFileSync(join(repoRoot, ...p), "utf8")

/** Parse `--name: value;` pairs per selector block. Comments stripped. */
function parseCss(css) {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const blocks = {}
  const re = /([^{}]+)\{([^{}]*)\}/g
  let m
  while ((m = re.exec(noComments))) {
    const selector = m[1].trim()
    const vars = (blocks[selector] ??= {})
    for (const decl of m[2].split(";")) {
      const i = decl.indexOf(":")
      if (i === -1) continue
      const name = decl.slice(0, i).trim()
      if (!name.startsWith("--")) continue
      vars[name] = decl.slice(i + 1).trim()
    }
  }
  return blocks
}

/** Resolve var(--x) chains against an env map; normalize whitespace. */
function resolve(value, env, seen = new Set()) {
  const out = value.replace(/var\((--[a-zA-Z0-9-]+)\)/g, (_, name) => {
    if (seen.has(name) || env[name] === undefined) return `var(${name})`
    return resolve(env[name], env, new Set([...seen, name]))
  })
  return out.replace(/\s+/g, " ").trim()
}

/* ---------- legacy side ---------- */
const legacyPrim = parseCss(read("app", "primitives.css"))[":root"] ?? {}
const brand = parseCss(read("app", "brand.css"))
const legacyRoot = brand[":root"] ?? {}
const legacyDark = brand[".dark"] ?? {}
const legacyTheme = brand["@theme"] ?? {}
const legacyEnv = { ...legacyPrim, ...legacyRoot }

/* ---------- dist side ---------- */
const distPrim = parseCss(read("dist", "tokens", "primitive.css"))[":root"] ?? {}
const distCompat = parseCss(read("dist", "tokens", "compat.css"))[":root"] ?? {}
const semantic = parseCss(read("dist", "tokens", "semantic.css"))
const distSem = semantic[":root"] ?? {}
const distTheme = semantic["@theme"] ?? {}
const distDark = parseCss(read("dist", "tokens", "modes", "dark.css"))[".dark"] ?? {}
const distEnv = { ...distPrim, ...distCompat, ...distSem }

/* ---------- compare ---------- */
let fail = 0
function compare(label, legacyVars, legacyEnvMap, distVars, distEnvMap) {
  let ok = 0
  for (const [name, lv] of Object.entries(legacyVars)) {
    const dv = distVars[name]
    if (dv === undefined) {
      fail++
      console.error(`✖ ${label}: ${name} missing on dist side`)
      continue
    }
    const l = resolve(lv, legacyEnvMap)
    const d = resolve(dv, distEnvMap)
    if (l !== d) {
      fail++
      console.error(`✖ ${label}: ${name}\n    legacy: ${l}\n    dist:   ${d}`)
    } else ok++
  }
  console.log(`${label}: ${ok}/${Object.keys(legacyVars).length} identical`)
}

compare("primitives (app/primitives.css)", legacyPrim, legacyEnv, { ...distCompat, ...distPrim }, distEnv)
compare("semantic :root (app/brand.css)", legacyRoot, legacyEnv, distSem, distEnv)
compare(
  "dark mode (app/brand.css .dark)",
  legacyDark,
  { ...legacyPrim, ...legacyDark },
  distDark,
  { ...distEnv, ...distDark }
)
compare("@theme axes (app/brand.css)", legacyTheme, legacyTheme, distTheme, distTheme)

const extra =
  Object.keys(distEnv).length -
  Object.keys(legacyPrim).length -
  Object.keys(legacyRoot).length
console.log(`info: ${extra} additive dist-only vars (--ll-*, --surface-*, --button-*, …)`)
console.log(fail ? `tokens:diff — ${fail} MISMATCH(ES)` : "tokens:diff — PARITY ✓")
process.exit(fail ? 1 : 0)
