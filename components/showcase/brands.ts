import type { CSSProperties } from "react"

/**
 * Preview brands for the showcase brand-switcher. These are runtime previews
 * only — they override a few brand tokens via inline CSS variables so a
 * designer can see the system under different brand colors WITHOUT touching
 * the branch's real theme (brand.config.json / app/brand.css).
 *
 * `seed` is the brand's primary color; the rest is derived.
 */
export type PreviewBrand = { id: string; name: string; seed: string | null }

export const PREVIEW_BRANDS: PreviewBrand[] = [
  { id: "default", name: "White Label", seed: null },
  { id: "kindmore-clinic", name: "Kindmore Clinic", seed: "#1051e3" },
]

/** Relative luminance (0–1) of a #rgb / #rrggbb color, else null. */
function luminance(hex: string): number | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Readable foreground for a base color. */
function contrast(hex: string): string {
  const l = luminance(hex)
  if (l === null) return "#fafafa"
  return l > 0.45 ? "#0a0a0a" : "#fafafa"
}

/** Inline CSS-variable overrides for a brand seed (empty = white-label). */
export function brandVars(seed: string | null): CSSProperties {
  if (!seed) return {}
  const fg = contrast(seed)
  return {
    "--primary": seed,
    "--primary-foreground": fg,
    "--ring": seed,
    "--sidebar-primary": seed,
    "--sidebar-primary-foreground": fg,
    "--chart-1": seed,
  } as CSSProperties
}
