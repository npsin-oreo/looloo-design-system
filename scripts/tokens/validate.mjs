#!/usr/bin/env node
/**
 * validate.mjs — validates the canonical token layer under tokens/.
 *
 * Checks (per LOOLOO_DS_V2_TOKEN_STRUCTURE.md §13):
 *   1. every tokens/x/*.json parses
 *   2. leaf tokens in primitive/semantic/component have $type and $value
 *   3. the primitive layer contains NO aliases (it is the ground truth)
 *   4. every {alias} resolves to an existing token with a $value
 *   5. no circular aliases
 *   6. semantic tokens do not reference component-layer paths
 *   7. mode overrides point at existing base token paths        (error)
 *   8. theme overrides point at existing base token paths       (warning —
 *      themes are PROPOSED scaffolds and may sketch new paths)
 *
 * Not yet checked (lands with the CSS build): generated CSS variable
 * uniqueness, deprecation replacement notes, contrast (audit-contrast).
 *
 * Run: npm run tokens:validate   — exits 1 on errors, 0 on warnings only.
 */
import { readFileSync, readdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "tokens")
const BASE_DIRS = ["primitive", "semantic", "component"]
const OVERLAY_DIRS = ["mode", "theme"]

const errors = []
const warnings = []

/* ---------- load ---------- */
function loadDir(dir) {
  const files = []
  for (const f of readdirSync(join(root, dir)).sort()) {
    if (!f.endsWith(".json")) continue
    try {
      files.push([`${dir}/${f}`, JSON.parse(readFileSync(join(root, dir, f), "utf8"))])
    } catch (e) {
      errors.push(`${dir}/${f}: invalid JSON — ${e.message}`)
    }
  }
  return files
}

function merge(a, b) {
  if (typeof b !== "object" || b === null || Array.isArray(b)) return b
  const o = { ...(typeof a === "object" && a !== null ? a : {}) }
  for (const [k, v] of Object.entries(b)) o[k] = merge(o[k], v)
  return o
}

const tree = {} // base layers merged: primitive + semantic + component
const baseFiles = BASE_DIRS.flatMap(loadDir)
const overlayFiles = OVERLAY_DIRS.flatMap(loadDir)
for (const [, json] of baseFiles)
  for (const [k, v] of Object.entries(json)) {
    if (k.startsWith("$")) continue
    tree[k] = merge(tree[k], v)
  }

const componentRoots = new Set(
  baseFiles
    .filter(([name]) => name.startsWith("component/"))
    .flatMap(([, json]) => Object.keys(json).filter((k) => !k.startsWith("$")))
)

/* ---------- helpers ---------- */
const isToken = (n) => n && typeof n === "object" && "$value" in n
const aliasOf = (v) => (typeof v === "string" ? /^\{(.+)\}$/.exec(v)?.[1] : undefined)

function lookup(path) {
  let n = tree
  for (const seg of path.split(".")) {
    if (n == null || typeof n !== "object") return undefined
    n = n[seg]
  }
  return n
}

function walkTokens(node, path, cb) {
  if (node == null || typeof node !== "object") return
  if (isToken(node)) cb(node, path)
  for (const [k, v] of Object.entries(node))
    if (!k.startsWith("$")) walkTokens(v, path ? `${path}.${k}` : k, cb)
}

/* ---------- 2+3: leaf shape & primitive purity ---------- */
for (const [file, json] of baseFiles) {
  walkTokens(json, "", (t, path) => {
    if (t.$type === undefined)
      errors.push(`${file}: ${path} is missing $type`)
    if (file.startsWith("primitive/") && aliasOf(t.$value))
      errors.push(`${file}: ${path} — primitive layer must not contain aliases (${t.$value})`)
  })
}

/* ---------- 4+5: alias resolution & circularity (base tree) ---------- */
function resolve(path, seen = []) {
  if (seen.includes(path)) {
    errors.push(`circular alias: ${[...seen, path].join(" → ")}`)
    return undefined
  }
  const t = lookup(path)
  if (!isToken(t)) return undefined
  const next = aliasOf(t.$value)
  return next ? resolve(next, [...seen, path]) : t.$value
}
for (const [file, json] of baseFiles) {
  walkTokens(json, "", (t, path) => {
    const target = aliasOf(t.$value)
    if (!target) return
    if (!isToken(lookup(target)))
      errors.push(`${file}: ${path} → {${target}} does not resolve`)
    else resolve(path) // surfaces circular chains
    /* 6: layer direction */
    if (file.startsWith("semantic/") && componentRoots.has(target.split(".")[0]))
      errors.push(`${file}: ${path} — semantic token references component layer ({${target}})`)
  })
}

/* ---------- 7+8: overlay override paths ---------- */
for (const [file, json] of overlayFiles) {
  const layer = file.split("/")[0] // mode | theme
  const role = json.mode ?? json.theme ?? {}
  for (const [name, overrides] of Object.entries(role)) {
    walkTokens(overrides, "", (t, path) => {
      // aliases inside overlay VALUES must resolve against the base tree
      const target = aliasOf(t.$value)
      if (target && !isToken(lookup(target)))
        errors.push(`${file}: ${name}.${path} → {${target}} does not resolve`)
      // the overridden PATH itself should exist in the base tree
      if (t.$type !== undefined && layer === "theme") return // theme may define new typed tokens (warned below if unknown)
      if (!isToken(lookup(path))) {
        const msg = `${file}: ${name} overrides "${path}" which does not exist in the base tree`
        if (layer === "mode") errors.push(msg)
        else warnings.push(`${msg} (theme scaffolds may sketch new paths)`)
      }
    })
  }
}

/* ---------- report ---------- */
for (const w of warnings) console.log(`⚠ ${w}`)
for (const e of errors) console.error(`✖ ${e}`)
const tokenCount = (() => {
  let n = 0
  walkTokens(tree, "", () => n++)
  return n
})()
console.log(
  `tokens:validate — ${tokenCount} tokens, ${baseFiles.length + overlayFiles.length} files, ` +
    `${errors.length} error(s), ${warnings.length} warning(s)`
)
process.exit(errors.length ? 1 : 0)
