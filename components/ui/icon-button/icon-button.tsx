import * as React from "react"

import { iconRegistry, type IconName } from "../../../icons/icon-registry"
import { Button } from "../button"

// IconButton size → Button's existing icon-* sizes (tokens/component/
// icon-button.json documents the {size.control.*} mapping).
const buttonSize = {
  xs: "icon-xs",
  sm: "icon-sm",
  md: "icon",
  lg: "icon-lg",
  xl: "icon-xl",
} as const

/**
 * Icon-only button with a REQUIRED accessible label.
 *
 * The icon is rendered as the raw registry component (not `<Icon>`), so
 * Button's per-size `[&_svg]` sizing rules keep applying exactly as they do
 * for hand-placed icons — IconButton is a11y sugar, not a new visual.
 */
function IconButton({
  icon,
  size = "md",
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "size" | "asChild"> & {
  icon: IconName
  size?: keyof typeof buttonSize
  /** Required: icon-only controls must name themselves. */
  "aria-label": string
}) {
  const IconComponent = iconRegistry[icon]
  return (
    <Button
      data-slot="icon-button"
      size={buttonSize[size]}
      aria-label={ariaLabel}
      {...props}
    >
      <IconComponent aria-hidden />
    </Button>
  )
}

export { IconButton }
