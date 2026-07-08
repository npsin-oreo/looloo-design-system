import type { iconRegistry, IconName } from "./icon-registry"

export type { IconName }

/** A component from the registry (lucide or a registered custom SVG). */
export type RegisteredIcon = (typeof iconRegistry)[IconName]

/** Size steps — map to tokens/component/icon.json (--icon-size-*). */
export type IconSize = "xs" | "sm" | "md" | "lg"

/** Color roles — map to semantic content tokens. */
export type IconTone = "default" | "muted" | "destructive"
