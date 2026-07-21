"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "../../../lib/utils"

/**
 * `requirement` marks the field, not the label:
 * - "required" → an asterisk, announced to screen readers as "required"
 * - "optional" → the word, because "not marked" is not a signal a user can see
 *
 * Pick ONE convention per form: mark the required fields OR the optional ones,
 * never both — if everything carries a mark, nothing stands out.
 */
type LabelRequirement = "default" | "required" | "optional"

function Label({
  className,
  requirement = "default",
  optionalText = "(ไม่บังคับ)",
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  requirement?: LabelRequirement
  /** Copy for the optional marker — swap per locale. */
  optionalText?: string
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-requirement={requirement}
      className={cn(
        "flex items-center gap-(--label-gap) text-(length:--label-font-size) leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        data-slot="label-content"
        className="inline-flex items-center gap-(--label-requirement-gap)"
      >
        {children}
        {requirement === "required" ? (
          <span
            data-slot="label-required"
            aria-label="required"
            className="text-(--destructive)"
          >
            *
          </span>
        ) : null}
        {requirement === "optional" ? (
          <span
            data-slot="label-optional"
            className="text-(length:--label-optional-font-size) font-normal text-(--muted-foreground)"
          >
            {optionalText}
          </span>
        ) : null}
      </span>
    </LabelPrimitive.Root>
  )
}

export { Label, type LabelRequirement }
