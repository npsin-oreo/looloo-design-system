"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import { XIcon } from "../../../icons/icon-registry"

// Dimensions come from component tokens (tokens/component/input.json →
// --input-*); values identical to the old hardcoded utilities.
const inputVariants = cva(
  "w-full min-w-0 rounded-(--input-radius) border border-input bg-transparent transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-(--focus-shadow) disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-(--focus-invalid-shadow) dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
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

/** Clear (X) button. Position is the caller's job; size/colour come from tokens. */
function ClearButton({
  className,
  ...props
}: React.ComponentProps<"button"> & { "aria-label": string }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className={cn(
        "absolute inline-flex items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:shadow-(--focus-shadow)",
        className
      )}
      {...props}
    >
      <XIcon />
    </button>
  )
}

/**
 * Clears a field through the native value setter so React's onChange still
 * fires — assigning `el.value = ""` directly leaves a controlled caller's
 * state stale.
 */
function clearField(el: HTMLInputElement | HTMLTextAreaElement) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, "")
  el.dispatchEvent(new Event("input", { bubbles: true }))
  el.focus()
}

function Input({
  className,
  type,
  size,
  clearable = false,
  onClear,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    /** Show a clear (X) button whenever the field holds a value. */
    clearable?: boolean
    onClear?: () => void
  }) {
  const ref = React.useRef<HTMLInputElement>(null)
  const controlled = props.value !== undefined
  const [hasValue, setHasValue] = React.useState(
    () => String(props.defaultValue ?? "").length > 0
  )
  const filled = controlled ? String(props.value ?? "").length > 0 : hasValue
  const showClear = clearable && filled && !props.disabled && !props.readOnly

  const field = (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      data-size={size ?? "md"}
      className={cn(
        inputVariants({ size }),
        clearable && "pe-(--input-clear-button-reserved-padding)",
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
    <div data-slot="input-wrapper" className="relative w-full">
      {field}
      {showClear ? (
        <ClearButton
          data-slot="input-clear"
          aria-label="Clear"
          className="top-1/2 right-(--input-clear-button-inset) size-(--input-clear-button-size) -translate-y-1/2 [&>svg]:size-full"
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

export { Input, inputVariants, ClearButton, clearField }
