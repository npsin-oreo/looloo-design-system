import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"

// Dimensions come from component tokens (tokens/component/input.json →
// --input-*); values identical to the old hardcoded utilities.
const inputVariants = cva(
  "w-full min-w-0 rounded-(--input-radius) border border-input bg-transparent transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-(--input-height-sm) px-(--input-padding-x-sm) py-(--input-padding-y-sm) text-sm file:h-5 file:text-xs",
        md: "h-(--input-height-md) px-(--input-padding-x-md) py-(--input-padding-y-md) text-base file:h-6 file:text-sm md:text-sm",
        xl: "h-(--input-height-xl) px-(--input-padding-x-xl) py-(--input-padding-y-xl) text-base file:h-7 file:text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      data-size={size ?? "md"}
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input, inputVariants }
