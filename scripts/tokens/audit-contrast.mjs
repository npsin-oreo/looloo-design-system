#!/usr/bin/env node
/**
 * audit-contrast.mjs — WCAG contrast audit of the important semantic
 * foreground/background pairs (LOOLOO_DS_V2_TOKEN_STRUCTURE.md §14).
 *
 * Report-first: prints a table with AA (4.5:1) / AA-large (3:1) verdicts and
 * exits 0 unless --strict is passed. Alpha colors are composited over the
 * light background before measuring.
 *
 * Run: npm run tokens:audit
 */
import { loadTokens, resolveValue } from "./lib-tokens.mjs"

const strict = process.argv.includes("--strict")
const { registry } = loadTokens()

/* ---------- oklch() → WCAG relative luminance ---------- */
function parseOklch(str) {
  const m = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/.exec(str)
  if (!m) return null
  const alpha = m[4] === undefined ? 1 : m[5] === "%" ? parseFloat(m[4]) / 100 : parseFloat(m[4])
  return { L: +m[1], C: +m[2], H: +m[3], alpha }
}
function oklchToLinearRgb({ L, C, H }) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((v) => Math.min(1, Math.max(0, v)))
}
const luminance = (rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
const composite = (fg, alpha, bg) => fg.map((v, i) => v * alpha + bg[i] * (1 - alpha))

function lumOf(path, base) {
  const entry = registry.get(path)
  if (!entry) return null
  const value = resolveValue(registry, entry.token.$value)
  const ok = parseOklch(value)
  if (!ok) return null
  let rgb = oklchToLinearRgb(ok)
  if (ok.alpha < 1 && base) rgb = composite(rgb, ok.alpha, base)
  return { lum: luminance(rgb), rgb, value }
}

/* ---------- pairs (§14, mapped to tokens that exist here) ---------- */
const PAIRS = [
  ["color.background", "color.foreground"],
  ["color.primary", "color.primary-foreground"],
  ["color.secondary", "color.secondary-foreground"],
  ["color.muted", "color.muted-foreground"],
  ["color.accent", "color.accent-foreground"],
  ["color.card", "color.card-foreground"],
  ["color.popover", "color.popover-foreground"],
  ["color.sidebar", "color.sidebar-foreground"],
  // radix-nova has no destructive-foreground: destructive is used as TEXT on background
  ["color.background", "color.destructive"],
  // proposed status pairs (flagged, not consumed yet)
  ["status.success", "status.success-foreground"],
  ["status.warning", "status.warning-foreground"],
  ["status.info", "status.info-foreground"],
]

let fails = 0
console.log("pair".padEnd(46) + "ratio   AA(4.5)  AA-large(3)")
for (const [bgPath, fgPath] of PAIRS) {
  const bg = lumOf(bgPath)
  const fg = bg && lumOf(fgPath, bg.rgb)
  if (!bg || !fg) {
    console.log(`${(bgPath + " / " + fgPath).padEnd(46)}skipped (unresolvable/non-oklch)`)
    continue
  }
  const [hi, lo] = bg.lum > fg.lum ? [bg.lum, fg.lum] : [fg.lum, bg.lum]
  const ratio = (hi + 0.05) / (lo + 0.05)
  const aa = ratio >= 4.5
  const aaLarge = ratio >= 3
  if (!aaLarge) fails++
  const proposed = registry.get(fgPath)?.token.$extensions?.["looloo.status"] === "proposed" ? " (proposed)" : ""
  console.log(
    `${(bgPath + " / " + fgPath).padEnd(46)}${ratio.toFixed(2).padEnd(8)}${(aa ? "✓" : "✗").padEnd(9)}${aaLarge ? "✓" : "✗"}${proposed}`
  )
}
console.log(`\ntokens:audit — ${fails} pair(s) below AA-large${strict ? "" : " (report-only; --strict to gate)"}`)
process.exit(strict && fails ? 1 : 0)
