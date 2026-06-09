#!/usr/bin/env node
/**
 * lib-oklch.mjs — convert any CSS color the brand layer uses (hex, rgb()/rgba(),
 * or an already-oklch() string) into an `oklch(…)` string.
 *
 * Pipeline: sRGB → linear → OKLab → OKLCH. Grays (chroma ≈ 0) collapse to
 * `oklch(L 0 0)`. Alpha is emitted as `/ N%`.
 *
 * Tailwind-v4 neutral hexes are SNAPPED to their canonical oklch so the
 * White-Label base is byte-identical to the `shadcn-skills-design-starter`
 * neutral theme (and so semantic tokens still alias cleanly onto the oklch
 * primitive layer).
 */

// Tailwind v4 canonical oklch for the neutral ramp (+ white/black) — snapped
// so round-trips don't drift by ±0.001 off the starter's values.
const SNAP = {
  "#ffffff": "oklch(1 0 0)",
  "#fafafa": "oklch(0.985 0 0)",
  "#f5f5f5": "oklch(0.97 0 0)",
  "#e5e5e5": "oklch(0.922 0 0)",
  "#d4d4d4": "oklch(0.87 0 0)",
  "#a3a3a3": "oklch(0.708 0 0)",
  "#737373": "oklch(0.556 0 0)",
  "#525252": "oklch(0.439 0 0)",
  "#404040": "oklch(0.371 0 0)",
  "#262626": "oklch(0.269 0 0)",
  "#171717": "oklch(0.205 0 0)",
  "#0a0a0a": "oklch(0.145 0 0)",
  "#000000": "oklch(0 0 0)",
}

/** Round to n decimals, trimming trailing zeros. */
function r(x, n) {
  return parseFloat(x.toFixed(n))
}

/** Parse a CSS color → { r, g, b, a } in 0–1 (sRGB), or null if unsupported. */
function parse(input) {
  const s = String(input).trim().toLowerCase()

  // #rgb / #rgba / #rrggbb / #rrggbbaa
  const hex = /^#([0-9a-f]{3,8})$/.exec(s)
  if (hex) {
    let h = hex[1]
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    if (h.length === 4) h = h.split("").map((c) => c + c).join("")
    if (h.length === 6) h += "ff"
    if (h.length !== 8) return null
    const [r8, g8, b8, a8] = [0, 2, 4, 6].map((i) => parseInt(h.slice(i, i + 2), 16))
    return { r: r8 / 255, g: g8 / 255, b: b8 / 255, a: a8 / 255 }
  }

  // rgb()/rgba() — comma or space separated, alpha as 0–1 or N%
  const rgb = /^rgba?\(([^)]+)\)$/.exec(s)
  if (rgb) {
    const parts = rgb[1].split(/[\s,\/]+/).filter(Boolean)
    if (parts.length < 3) return null
    const num = (p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p))
    const chan = (p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255)
    return {
      r: chan(parts[0]),
      g: chan(parts[1]),
      b: chan(parts[2]),
      a: parts[3] != null ? num(parts[3]) : 1,
    }
  }

  return null
}

/** sRGB channel (0–1) → linear. */
function lin(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Format alpha as a ` / N%` suffix (omitted when fully opaque). */
function alphaSuffix(a) {
  if (a >= 0.999) return ""
  const pct = r(a * 100, 3)
  return ` / ${pct}%`
}

/**
 * Convert any supported CSS color to an `oklch(…)` string.
 * Already-oklch() input is returned unchanged. Unsupported input throws.
 */
export function toOklch(input) {
  const s = String(input).trim()
  if (/^oklch\(/i.test(s)) return s

  const key = s.toLowerCase()
  if (key in SNAP) return SNAP[key]
  // snapped opaque hex with explicit alpha → reuse L, append alpha
  const hexA = /^#([0-9a-f]{8})$/.exec(key)
  if (hexA) {
    const base = "#" + hexA[1].slice(0, 6)
    if (base in SNAP) {
      const a = parseInt(hexA[1].slice(6, 8), 16) / 255
      const suffix = alphaSuffix(a)
      if (suffix) return SNAP[base].replace(/\)$/, `${suffix})`)
      return SNAP[base]
    }
  }

  const c = parse(s)
  if (!c) throw new Error(`lib-oklch: cannot parse color "${input}"`)

  const R = lin(c.r), G = lin(c.g), B = lin(c.b)

  // linear sRGB → LMS (OKLab matrix)
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B
  const s_ = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s2 = Math.cbrt(s_)

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s2
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s2
  const Bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s2

  let C = Math.hypot(A, Bb)
  let H = (Math.atan2(Bb, A) * 180) / Math.PI
  if (H < 0) H += 360

  const Lr = r(L, 3)
  const Cr = r(C, 3)
  const suffix = alphaSuffix(c.a)

  // Achromatic → drop hue/chroma noise.
  if (Cr <= 0.0005) return `oklch(${Lr} 0 0${suffix})`

  return `oklch(${Lr} ${Cr} ${r(H, 3)}${suffix})`
}

// CLI smoke test: `node scripts/lib-oklch.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  const cases = [
    "#ffffff", "#0a0a0a", "#171717", "#fafafa", "#f5f5f5", "#e5e5e5",
    "#737373", "#a3a3a3", "#dc2626", "#f87171", "#6b7280", "#4b5563",
    "#2e89ff", "#ff7a4d", "#0000004d", "rgb(0 0 0 / 0.3)",
    "rgb(255 255 255 / 0.8)", "oklch(0.205 0 0)",
  ]
  for (const c of cases) console.log(c.padEnd(20), "→", toOklch(c))
}
