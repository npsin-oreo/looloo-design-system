import * as React from "react"

import { iconRegistry, type IconName } from "../../../icons/icon-registry"
import type { IconSize, IconTone } from "../../../icons/icon-types"
import { cn } from "../../../lib/utils"

// Sizes come from component tokens (tokens/component/icon.json → --icon-size-*).
const sizeClasses: Record<IconSize, string> = {
  xs: "size-(--icon-size-xs)",
  sm: "size-(--icon-size-sm)",
  md: "size-(--icon-size-md)",
  lg: "size-(--icon-size-lg)",
}

// Tones map to semantic content roles — never raw palette colors.
const toneClasses: Record<IconTone, string> = {
  default: "",
  muted: "text-muted-foreground",
  destructive: "text-destructive",
}

function Icon({
  name,
  size = "md",
  tone = "default",
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> & {
  name: IconName
  size?: IconSize
  tone?: IconTone
}) {
  const IconComponent = iconRegistry[name]
  return (
    <IconComponent
      data-slot="icon"
      aria-hidden={props["aria-label"] ? undefined : true}
      className={cn(sizeClasses[size], toneClasses[tone], className)}
      {...props}
    />
  )
}

export { Icon, iconRegistry, type IconName }
