import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

import { logoArtwork, type LogoType } from "./logo-artwork"

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
}

/**
 * The Virtual Agent logo, as a component — not artwork you copy. The vector
 * scales with the frame: size it with a height utility (`className="h-10"`)
 * and the width follows the aspect ratio. Never scale the vector inside it.
 *
 * The geometry is brand-specific and lives in ./logo-artwork.tsx — the file a
 * brand branch swaps. This component stays brand-agnostic.
 */
export function Logo({
  type = "mark",
  tone = "brand",
  label = "Virtual Agent",
  className,
  style,
  ...props
}: LogoProps) {
  const art = logoArtwork[type]
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

export { type LogoType }
