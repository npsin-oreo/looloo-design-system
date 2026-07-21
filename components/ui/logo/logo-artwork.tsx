/**
 * Neutral white-label logo artwork — the DEFAULT the package ships.
 *
 * `main` is brand-agnostic: this is a placeholder mark (a rounded-square
 * aperture + wordmark bars), NOT any real brand's logo. It exists so
 * <Logo> renders something sensible before a brand supplies its own vector.
 *
 * A brand overrides the geometry per-instance via the <Logo artwork={…}>
 * slot — same topology as the token theme overlay (colour flows through the
 * `--ll-color-brand-*` primitives the theme recolours; only the geometry is
 * brand-specific). Brand artwork lives OUTSIDE this file, in a brand-scoped
 * sibling: e.g. brands/virtual-agent/logo-artwork.tsx → `virtualAgentLogoArtwork`.
 *
 * Colours are bound to CSS custom properties the <Logo> component sets per
 * tone (see ./logo.tsx `toneVars`):
 *   --logo-fg-accent    → the mark
 *   --logo-fg-wordmark  → the wordmark bars
 *   --logo-plate        → inverse plate
 *   --logo-fg-on-plate  → inverse artwork
 */
import type { ReactNode } from "react"

export type LogoType = "mark" | "lockup" | "horizontal"

export type LogoArtwork = {
  /** viewBox for brand/mono tones */
  viewBox: string
  body: ReactNode
  /** viewBox for the inverse tone (includes the plate padding) */
  inverseViewBox: string
  inverseBody: ReactNode
}

/** A complete brand vector: one {@link LogoArtwork} per {@link LogoType}. The `artwork` slot on <Logo>. */
export type LogoArtworkSet = Record<LogoType, LogoArtwork>

/** The placeholder mark: a rounded-square aperture, single colour. */
const markShapes = (accent: string) => (
  <>
    <rect x="3" y="3" width="34" height="34" rx="9" fill="none" stroke={accent} strokeWidth="3" />
    <circle cx="20" cy="20" r="5.5" fill={accent} />
  </>
)

/** The placeholder mark, offset for the inverse plate padding. */
const markShapesOffset = (fg: string, dx: number, dy: number) => (
  <>
    <rect x={3 + dx} y={3 + dy} width="34" height="34" rx="9" fill="none" stroke={fg} strokeWidth="3" />
    <circle cx={20 + dx} cy={20 + dy} r="5.5" fill={fg} />
  </>
)

/** Placeholder wordmark: a solid bar (brand supplies the real wordmark). */
const wordmarkBar = (fg: string, x: number, y: number, w: number) => (
  <rect x={x} y={y} width={w} height="10" rx="5" fill={fg} />
)

const ACCENT = "var(--logo-fg-accent)"
const WORDMARK = "var(--logo-fg-wordmark)"
const PLATE = "var(--logo-plate)"
const ON_PLATE = "var(--logo-fg-on-plate)"

export const defaultLogoArtwork: LogoArtworkSet = {
  mark: {
    viewBox: "0 0 40 40",
    body: markShapes(ACCENT),
    inverseViewBox: "0 0 56 56",
    inverseBody: (
      <>
        <rect width="56" height="56" rx="12" fill={PLATE} />
        {markShapesOffset(ON_PLATE, 8, 8)}
      </>
    ),
  },
  lockup: {
    viewBox: "0 0 132 40",
    body: (
      <>
        {markShapes(ACCENT)}
        {wordmarkBar(WORDMARK, 52, 15, 72)}
      </>
    ),
    inverseViewBox: "0 0 148 56",
    inverseBody: (
      <>
        <rect width="148" height="56" rx="12" fill={PLATE} />
        {markShapesOffset(ON_PLATE, 8, 8)}
        {wordmarkBar(ON_PLATE, 60, 23, 72)}
      </>
    ),
  },
  horizontal: {
    viewBox: "0 0 172 40",
    body: (
      <>
        {markShapes(ACCENT)}
        {wordmarkBar(WORDMARK, 52, 15, 112)}
      </>
    ),
    inverseViewBox: "0 0 188 56",
    inverseBody: (
      <>
        <rect width="188" height="56" rx="12" fill={PLATE} />
        {markShapesOffset(ON_PLATE, 8, 8)}
        {wordmarkBar(ON_PLATE, 60, 23, 112)}
      </>
    ),
  },
}

/** @deprecated alias for the flat re-export — use `defaultLogoArtwork`. */
export const logoArtwork = defaultLogoArtwork
