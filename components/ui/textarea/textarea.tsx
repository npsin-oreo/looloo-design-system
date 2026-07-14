"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import { ClearButton, clearField } from "../input"

const textareaVariants = cva(
  "flex field-sizing-content w-full rounded-lg border border-input bg-transparent transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-(--focus-shadow) disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-(--focus-invalid-shadow) dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
  {
    variants: {
      size: {
        sm: "min-h-12 px-2.5 py-1.5 text-sm",
        md: "min-h-16 px-2.5 py-2 text-base md:text-sm",
        xl: "min-h-24 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

function Textarea({
  className,
  size,
  clearable = false,
  onClear,
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants> & {
    /** Show a clear (X) button whenever the field holds a value. */
    clearable?: boolean
    onClear?: () => void
  }) {
  const ref = React.useRef<HTMLTextAreaElement>(null)
  const controlled = props.value !== undefined
  const [hasValue, setHasValue] = React.useState(
    () => String(props.defaultValue ?? "").length > 0
  )
  const filled = controlled ? String(props.value ?? "").length > 0 : hasValue
  const showClear = clearable && filled && !props.disabled && !props.readOnly

  const field = (
    <textarea
      ref={ref}
      data-slot="textarea"
      data-size={size ?? "md"}
      className={cn(
        textareaVariants({ size }),
        clearable && "pe-(--textarea-clear-button-reserved-padding)",
        className
      )}
      {...props}
      onChange={(e) => {
        if (!controlled) setHasValue(e.target.value.length > 0)
        props.onChange?.(e)
      }}
    />
  )

  if (!clearable) return field

  return (
    <div data-slot="textarea-wrapper" className="relative w-full">
      {field}
      {showClear ? (
        <ClearButton
          data-slot="textarea-clear"
          aria-label="Clear"
          // top-right, not centred: the field grows downward, the button must not travel with it
          className="top-(--textarea-clear-button-inset) right-(--textarea-clear-button-inset) size-(--textarea-clear-button-size) [&>svg]:size-full"
          onClick={() => {
            if (ref.current) clearField(ref.current)
            if (!controlled) setHasValue(false)
            onClear?.()
          }}
        />
      ) : null}
    </div>
  )
}

export { Textarea, textareaVariants }
