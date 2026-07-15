"use client"

import * as React from "react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"

import { cn } from "../../../lib/utils"

const itemStyles =
  "inline-flex h-8 items-center justify-center gap-2 rounded-(--toolbar-button-radius) px-2.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:shadow-(--focus-shadow) disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0"

function Toolbar({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function ToolbarButton({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Button>) {
  return (
    <ToolbarPrimitive.Button
      data-slot="toolbar-button"
      className={cn(itemStyles, className)}
      {...props}
    />
  )
}

function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Link>) {
  return (
    <ToolbarPrimitive.Link
      data-slot="toolbar-link"
      className={cn(itemStyles, "cursor-pointer", className)}
      {...props}
    />
  )
}

function ToolbarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("mx-1 h-6 w-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

function ToolbarToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup>) {
  return (
    <ToolbarPrimitive.ToggleGroup
      data-slot="toolbar-toggle-group"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function ToolbarToggleItem({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  return (
    <ToolbarPrimitive.ToggleItem
      data-slot="toolbar-toggle-item"
      className={cn(
        itemStyles,
        "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
}
