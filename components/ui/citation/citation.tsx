"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"

type CitationSource = {
  /** Display title. Falls back to the citation number when omitted. */
  title?: string
  /** External link. When present the citation renders as a link. */
  url?: string
  /** Leading icon, typically a favicon. */
  icon?: React.ReactNode
}

type CitationProps = Omit<React.ComponentProps<"a">, "href"> & {
  source: CitationSource
  /** Display index of this citation. */
  number: number
  /** `label` shows the source title; `number` is a compact reference marker. */
  variant?: "label" | "number"
}

function Citation({ source, number, variant = "label", className, ...props }: CitationProps) {
  const title = source.title ?? String(number)
  const href = source.url
  const ariaLabel = `Citation ${number}: ${title}`
  const linkProps = href
    ? { href, target: "_blank" as const, rel: "noreferrer" }
    : { role: "note" as const }
  const Comp: "a" | "span" = href ? "a" : "span"

  if (variant === "number") {
    return (
      <Comp
        data-slot="citation"
        data-variant="number"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex size-4 items-center justify-center rounded-full bg-muted align-super text-[0.625rem] font-medium text-muted-foreground no-underline transition-colors",
          href && "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...linkProps}
        {...props}
      >
        {number}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="citation"
      data-variant="label"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-64 items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-0.5 align-middle text-xs font-medium text-foreground no-underline transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0",
        href && "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...linkProps}
      {...props}
    >
      {source.icon}
      <span className="truncate">{title}</span>
      <span className="text-muted-foreground tabular-nums">{number}</span>
    </Comp>
  )
}

export { Citation, type CitationProps, type CitationSource }
