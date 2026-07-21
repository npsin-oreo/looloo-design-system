import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

import { defaultLogoArtwork, type LogoArtwork, type LogoArtworkSet, type LogoType } from "./logo-artwork"

export type LogoTone = "brand" | "mono" | "inverse"

/**
 * Per-tone colour bindings. Every colour is a brand primitive, so the logo
 * follows a rebrand of the tokens instead of being a stale, hard-coded PNG.
 *   brand   — the real thing: teal mark/accent on a navy wordmark.
 *   mono    — one navy, for print / a stamp / anywhere a second colour is a lie.
 *   inverse — white artwork on a navy plate (the only place white is legal).
 */
const toneVars: Record<LogoTone, CSSProperties> = {
  brand: {
    "--logo-fg-accent": "var(--ll-color-brand-primary-300)",
    "--logo-fg-wordmark": "var(--ll-color-brand-secondary-950)",
  } as CSSProperties,
  mono: {
    "--logo-fg-accent": "var(--ll-color-brand-secondary-950)",
    "--logo-fg-wordmark": "var(--ll-color-brand-secondary-950)",
  } as CSSProperties,
  inverse: {
    "--logo-plate": "var(--ll-color-brand-secondary-950)",
    "--logo-fg-on-plate": "var(--ll-color-white)",
  } as CSSProperties,
}

export type LogoProps = Omit<React.ComponentPropsWithoutRef<"svg">, "type"> & {
  /** `mark` = symbol only · `lockup` = symbol + wordmark · `horizontal` = wide lockup. */
  type?: LogoType
  tone?: LogoTone
  /** Accessible name. Pass `""` to render decoratively (`aria-hidden`). */
  label?: string
  /**
   * Brand geometry slot. Defaults to the neutral white-label placeholder.
   * A brand supplies its own vector object (e.g. `virtualAgentLogoArtwork`
   * from `@npsin-oreo/design-system/brands/virtual-agent/logo-artwork`) —
   * colour still flows through the `--ll-color-brand-*` tokens the theme
   * overlay recolours, so only the shape is brand-specific.
   */
  artwork?: LogoArtworkSet
}

/**
 * The logo, as a component — not artwork you copy. The vector scales with the
 * frame: size it with a height utility (`className="h-10"`) and the width
 * follows the aspect ratio. Never scale the vector inside it.
 *
 * This component is brand-agnostic. The default geometry is the neutral
 * placeholder in ./logo-artwork.tsx; a brand injects its own via `artwork`
 * (same overlay topology as the token theme). Colour is bound to brand
 * primitives per tone, so a rebrand of the tokens flows through automatically.
 */
export function Logo({
  type = "mark",
  tone = "brand",
  label = "Logo",
  artwork = defaultLogoArtwork,
  className,
  style,
  ...props
}: LogoProps) {
  const art = artwork[type]
  const isInverse = tone === "inverse"
  const decorative = label === ""

  return (
    <svg
      viewBox={isInverse ? art.inverseViewBox : art.viewBox}
      className={cn("inline-block h-8 w-auto", className)}
      style={{ ...toneVars[tone], ...style }}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      {...props}
    >
      {isInverse ? art.inverseBody : art.body}
    </svg>
  )
}

export { defaultLogoArtwork, type LogoArtwork, type LogoArtworkSet, type LogoType }
