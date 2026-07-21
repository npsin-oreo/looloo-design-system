import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import { Loader2Icon } from "../../../icons/icon-registry"

const spinnerVariants = cva("size-(--spinner-size) animate-spin", {
  variants: {
    /**
     * Where the spinner is, not how important it is.
     * - inherit → takes the text colour around it (a spinner inside a button, a row, a cell)
     * - primary → the brand teal, for a spinner that stands alone on the page and IS the content
     * - on-brand → white, for a spinner sitting on a filled brand surface
     */
    tone: {
      inherit: "text-current",
      primary: "text-(--primary)",
      "on-brand": "text-(--primary-foreground)",
    },
  },
  defaultVariants: {
    tone: "inherit",
  },
})

function Spinner({
  className,
  tone,
  ...props
}: React.ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ tone }), className)}
      {...props}
    />
  )
}

export { Spinner, spinnerVariants }
