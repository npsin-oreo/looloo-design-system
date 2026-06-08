import type { ReactNode } from "react"

/** A single component demo rendered in the showcase. */
export type Demo = {
  /** Anchor id — also the sidebar link target. */
  id: string
  /** Display title (component name). */
  title: string
  /** One-line description of what the component is for. */
  description?: string
  /** The rendered demo. */
  node: ReactNode
}

/** An Atomic-Design tier (Atoms / Molecules / Organisms). */
export type Tier = {
  id: string
  label: string
  /** Short explanation of the tier in the Atomic Design model. */
  blurb: string
  demos: Demo[]
}
