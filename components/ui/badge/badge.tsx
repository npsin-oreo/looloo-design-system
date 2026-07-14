import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../../../lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-(--badge-height) w-fit shrink-0 items-center justify-center gap-(--badge-gap) overflow-hidden rounded-(--badge-radius) border border-transparent px-(--badge-padding-x) py-(--badge-padding-y) text-(length:--badge-font-size) font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:shadow-(--focus-shadow) has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:shadow-(--focus-invalid-shadow) [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-(--primary-hover)",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:shadow-(--focus-invalid-shadow) dark:bg-destructive/20 [a]:hover:bg-destructive/20",
        success:
          "bg-(--badge-color-success-surface) text-(--badge-color-success-foreground) [a]:hover:bg-(--badge-color-success-hover-surface)",
        warning:
          "bg-(--badge-color-warning-surface) text-(--badge-color-warning-foreground) [a]:hover:bg-(--badge-color-warning-hover-surface)",
        info: "bg-(--badge-color-info-surface) text-(--badge-color-info-foreground) [a]:hover:bg-(--badge-color-info-hover-surface)",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
