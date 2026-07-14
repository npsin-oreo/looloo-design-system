"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import {
  ChevronDown,
  CircleCheck,
  Clock,
  Loader2,
  TriangleAlert,
} from "../../../icons/icon-registry"
import { Badge } from "../badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"

type ChatToolCallStatus = "pending" | "running" | "complete" | "error"

type ChatToolCallItem = {
  /** Tool / function name. */
  name: string
  /** @default "complete" */
  status?: ChatToolCallStatus
  /** What the tool acted on — a file path, command, or query. */
  target?: string
  /** Duration label (e.g. "1.2s"), shown when complete. */
  duration?: string
  /** Sandbox/node name, shown as a pill badge. */
  node?: string
  /** Lines added — rendered in success color. */
  additions?: number
  /** Lines removed — rendered in destructive color. */
  deletions?: number
  /** Free-form content after the label. */
  stats?: React.ReactNode
  /** Error text shown in a tooltip on the status icon. */
  errorMessage?: string
  /** Stable list key; derived from metadata when omitted. */
  key?: string
  /** Expandable inline detail (diff, command output, …). */
  resultDetail?: React.ReactNode
}

type ChatToolCallsProps = Omit<React.ComponentProps<"div">, "children"> & {
  calls: ChatToolCallItem[]
  /** Summary label for the collapsed multi-call view. */
  label?: string
  expanded?: boolean
  /** @default true for ≤3 calls, false for more. */
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

const STATUS_ICON: Record<ChatToolCallStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  running: Loader2,
  complete: CircleCheck,
  error: TriangleAlert,
}

function ToolCallStatusIcon({ status, errorMessage }: { status: ChatToolCallStatus; errorMessage?: string }) {
  const Icon = STATUS_ICON[status]
  const icon = (
    <Icon
      className={cn(
        "size-3.5 shrink-0",
        status === "error" ? "text-destructive" : "text-muted-foreground",
        status === "running" && "animate-spin"
      )}
    />
  )
  if (status === "error" && errorMessage) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex" tabIndex={0} aria-label={errorMessage}>
            {icon}
          </span>
        </TooltipTrigger>
        <TooltipContent>{errorMessage}</TooltipContent>
      </Tooltip>
    )
  }
  return icon
}

function toolCallKey(call: ChatToolCallItem, index: number) {
  return call.key ?? `${call.name}:${call.target ?? ""}:${index}`
}

function ToolCallRow({ call }: { call: ChatToolCallItem }) {
  const status = call.status ?? "complete"
  const [open, setOpen] = React.useState(false)
  const hasDetail = Boolean(call.resultDetail)

  return (
    <div className="px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        <ToolCallStatusIcon status={status} errorMessage={call.errorMessage} />
        <span className="font-medium">{call.name}</span>
        {call.target ? (
          <span className="truncate font-mono text-xs text-muted-foreground">{call.target}</span>
        ) : null}
        {call.node ? (
          <Badge variant="secondary" className="shrink-0">{call.node}</Badge>
        ) : null}
        {typeof call.additions === "number" ? (
          <span className="shrink-0 font-mono text-xs text-[var(--status-success)]">+{call.additions}</span>
        ) : null}
        {typeof call.deletions === "number" ? (
          <span className="shrink-0 font-mono text-xs text-destructive">-{call.deletions}</span>
        ) : null}
        {call.stats}
        <span className="ml-auto flex shrink-0 items-center gap-2">
          {status === "complete" && call.duration ? (
            <span className="text-xs text-muted-foreground">{call.duration}</span>
          ) : null}
          {hasDetail ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Hide detail" : "Show detail"}
              className="rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:shadow-(--focus-shadow)"
            >
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
          ) : null}
        </span>
      </div>
      {hasDetail && open ? (
        <div className="mt-2 border-t pt-2 text-xs">{call.resultDetail}</div>
      ) : null}
    </div>
  )
}

function ChatToolCalls({
  calls,
  label,
  expanded,
  defaultExpanded,
  onExpandedChange,
  className,
  ...props
}: ChatToolCallsProps) {
  const isMulti = calls.length > 1
  const initial = defaultExpanded ?? calls.length <= 3
  const [internalOpen, setInternalOpen] = React.useState(initial)
  const isControlled = expanded !== undefined
  const open = isControlled ? expanded : internalOpen

  const toggle = () => {
    const next = !open
    if (!isControlled) setInternalOpen(next)
    onExpandedChange?.(next)
  }

  if (calls.length === 0) return null

  return (
    <div
      data-slot="chat-tool-calls"
      className={cn("overflow-hidden rounded-lg border bg-card", className)}
      {...props}
    >
      {isMulti ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm outline-none hover:bg-muted/50 focus-visible:shadow-(--focus-shadow) focus-visible:outline-none"
        >
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
          <span className="font-medium">{label ?? `${calls.length} tool calls`}</span>
          {!open ? (
            <span className="truncate font-mono text-xs text-muted-foreground">
              {calls[calls.length - 1].name}
            </span>
          ) : null}
        </button>
      ) : null}
      {open || !isMulti ? (
        <div className={cn(isMulti && "border-t", "divide-y")}>
          {calls.map((call, i) => (
            <ToolCallRow key={toolCallKey(call, i)} call={call} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export {
  ChatToolCalls,
  type ChatToolCallsProps,
  type ChatToolCallItem,
  type ChatToolCallStatus,
}
