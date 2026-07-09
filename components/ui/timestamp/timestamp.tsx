"use client"

import * as React from "react"
import { format, formatDistanceToNow } from "date-fns"

import { cn } from "../../../lib/utils"

type TimestampFormat = "relative" | "auto" | "date" | "datetime" | "time"

type TimestampProps = Omit<React.ComponentProps<"time">, "dateTime" | "children"> & {
  /** The moment to render — Date, epoch ms, or ISO string. */
  value: Date | string | number
  /**
   * `relative` → "2 hours ago"; `date` → "Mar 21, 2025"; `datetime`,
   * `time`; `auto` shows relative until `autoThreshold`, then `datetime`.
   * @default "auto"
   */
  format?: TimestampFormat
  /** Seconds before `auto` switches from relative to datetime. @default 604800 (7d) */
  autoThreshold?: number
  /** Re-render relative labels on an interval so "2 min ago" stays current. */
  live?: boolean
}

const FORMAT_MASK: Record<Exclude<TimestampFormat, "relative" | "auto">, string> = {
  date: "PP",
  datetime: "PPp",
  time: "p",
}

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value)
}

function absolute(date: Date, fmt: Exclude<TimestampFormat, "relative" | "auto">) {
  return format(date, FORMAT_MASK[fmt])
}

function Timestamp({
  value,
  format: fmt = "auto",
  autoThreshold = 604800,
  live = false,
  className,
  ...props
}: TimestampProps) {
  const date = React.useMemo(() => toDate(value), [value])
  const iso = Number.isNaN(date.getTime()) ? undefined : date.toISOString()

  // SSR-safe seed: render an absolute label first, then swap to the relative
  // label after mount so server and client markup match (no hydration warning).
  const seed = React.useMemo(
    () => absolute(date, fmt === "relative" || fmt === "auto" ? "datetime" : fmt),
    [date, fmt]
  )
  const [label, setLabel] = React.useState(seed)

  React.useEffect(() => {
    if (Number.isNaN(date.getTime())) return

    const compute = () => {
      if (fmt === "date" || fmt === "datetime" || fmt === "time") {
        setLabel(absolute(date, fmt))
        return
      }
      const elapsed = (Date.now() - date.getTime()) / 1000
      if (fmt === "auto" && Math.abs(elapsed) > autoThreshold) {
        setLabel(absolute(date, "datetime"))
      } else {
        setLabel(formatDistanceToNow(date, { addSuffix: true }))
      }
    }

    compute()
    const isRelative = fmt === "relative" || fmt === "auto"
    if (!live || !isRelative) return
    const id = setInterval(compute, 30_000)
    return () => clearInterval(id)
  }, [date, fmt, autoThreshold, live])

  return (
    <time
      data-slot="timestamp"
      dateTime={iso}
      suppressHydrationWarning
      className={cn("text-sm text-muted-foreground tabular-nums", className)}
      {...props}
    >
      {label}
    </time>
  )
}

export { Timestamp, type TimestampProps, type TimestampFormat }
