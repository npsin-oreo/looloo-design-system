"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import { Check, CircleCheck, Clock, TriangleAlert } from "../../../icons/icon-registry"
import { Separator } from "../separator"

type ChatSender = "user" | "assistant" | "system"
type ChatDensity = "compact" | "balanced" | "spacious"
type ChatStatus = "sending" | "sent" | "delivered" | "read" | "error"

const SenderContext = React.createContext<ChatSender>("assistant")
const DensityContext = React.createContext<ChatDensity>("balanced")

function useChatSender() {
  return React.useContext(SenderContext)
}

const DENSITY_GAP: Record<ChatDensity, string> = {
  compact: "gap-2",
  balanced: "gap-4",
  spacious: "gap-6",
}

/* ───────────────────────── ChatMessageList ───────────────────────── */

type ChatMessageListProps = React.ComponentProps<"div"> & {
  /** Shown when there are no message children. */
  emptyState?: React.ReactNode
  /** Row spacing, flowed to messages via context. @default "balanced" */
  density?: ChatDensity
  /** Marks the log `aria-busy` so assistants aren't re-announced per token. */
  isStreaming?: boolean
}

function ChatMessageList({
  children,
  emptyState = "Nothing to show.",
  density = "balanced",
  isStreaming = false,
  className,
  ...props
}: ChatMessageListProps) {
  const isEmpty = React.Children.count(children) === 0
  return (
    <DensityContext.Provider value={density}>
      <div
        role="log"
        aria-live="polite"
        aria-busy={isStreaming || undefined}
        data-slot="chat-message-list"
        data-density={density}
        className={cn("flex flex-1 flex-col overflow-y-auto p-4", className)}
        {...props}
      >
        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            {emptyState}
          </div>
        ) : (
          <>
            <div className="flex-1" aria-hidden />
            <div className={cn("flex flex-col", DENSITY_GAP[density])}>{children}</div>
          </>
        )}
      </div>
    </DensityContext.Provider>
  )
}

/* ───────────────────────── ChatMessage ───────────────────────── */

type ChatMessageProps = React.ComponentProps<"div"> & {
  /** Who sent this message — controls alignment and bubble color. */
  sender: ChatSender
  /** Avatar rendered beside the message. Typically `<Avatar>`. */
  avatar?: React.ReactNode
  /** Name above the body; use when the first child is raw (not a bubble). */
  name?: React.ReactNode
  /** Metadata below the body; use when the last child is raw (not a bubble). */
  metadata?: React.ReactNode
}

function ChatMessage({
  sender,
  avatar,
  name,
  metadata,
  children,
  className,
  ...props
}: ChatMessageProps) {
  const isUser = sender === "user"
  return (
    <SenderContext.Provider value={sender}>
      <div
        data-slot="chat-message"
        data-sender={sender}
        className={cn("flex items-end gap-2", isUser && "flex-row-reverse", className)}
        {...props}
      >
        {avatar ? <div className="shrink-0">{avatar}</div> : null}
        <div className={cn("flex min-w-0 flex-col gap-1", isUser ? "items-end" : "items-start")}>
          {name ? (
            <span className="px-1 text-xs font-medium text-muted-foreground">{name}</span>
          ) : null}
          {children}
          {metadata}
        </div>
      </div>
    </SenderContext.Provider>
  )
}

/* ───────────────────────── ChatMessageBubble ───────────────────────── */

type ChatMessageBubbleProps = React.ComponentProps<"div"> & {
  /** `filled` shows a sender-colored surface; `ghost` keeps padding only. */
  variant?: "filled" | "ghost"
  /** Name above the bubble, aligned with bubble padding. */
  name?: React.ReactNode
  /** Metadata below the bubble, aligned with bubble padding. */
  metadata?: React.ReactNode
  /** Position within a same-sender run — reduces corner radius on that side. */
  group?: "first" | "middle" | "last"
}

function groupCorners(isUser: boolean, group: ChatMessageBubbleProps["group"]) {
  if (!group) return ""
  if (group === "first") return isUser ? "rounded-br-md" : "rounded-bl-md"
  if (group === "last") return isUser ? "rounded-tr-md" : "rounded-tl-md"
  return isUser ? "rounded-tr-md rounded-br-md" : "rounded-tl-md rounded-bl-md"
}

function ChatMessageBubble({
  variant = "filled",
  name,
  metadata,
  group,
  children,
  className,
  ...props
}: ChatMessageBubbleProps) {
  const sender = useChatSender()
  const isUser = sender === "user"
  const filled = variant === "filled"
  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      {name ? (
        <span className="px-3 text-xs font-medium text-muted-foreground">{name}</span>
      ) : null}
      <div
        data-slot="chat-message-bubble"
        data-sender={sender}
        data-variant={variant}
        className={cn(
          "max-w-prose rounded-2xl px-3 py-2 text-sm break-words",
          filled
            ? isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
            : "bg-transparent",
          groupCorners(isUser, group),
          className
        )}
        {...props}
      >
        {children}
      </div>
      {metadata}
    </div>
  )
}

/* ───────────────────────── ChatMessageMetadata ───────────────────────── */

const STATUS: Record<ChatStatus, { icon: React.ComponentType<{ className?: string }>; label: string; className?: string }> = {
  sending: { icon: Clock, label: "Sending" },
  sent: { icon: Check, label: "Sent" },
  delivered: { icon: CircleCheck, label: "Delivered" },
  read: { icon: CircleCheck, label: "Read", className: "text-primary" },
  error: { icon: TriangleAlert, label: "Error", className: "text-destructive" },
}

type ChatMessageMetadataProps = React.ComponentProps<"div"> & {
  /** Timestamp content — a string or `<Timestamp>`. */
  timestamp?: React.ReactNode
  /** Trailing content: model info, reactions, copy button. */
  footer?: React.ReactNode
  /** Delivery status — renders an icon + label. */
  status?: ChatStatus
}

function ChatMessageMetadata({
  timestamp,
  footer,
  status,
  className,
  ...props
}: ChatMessageMetadataProps) {
  const isUser = useChatSender() === "user"
  if (!timestamp && !footer && !status) return null
  const s = status ? STATUS[status] : null
  const StatusIcon = s?.icon
  return (
    <div
      data-slot="chat-message-metadata"
      className={cn(
        "flex items-center gap-2 px-1 text-xs text-muted-foreground",
        isUser && "flex-row-reverse",
        className
      )}
      {...props}
    >
      {timestamp ? <span>{timestamp}</span> : null}
      {footer}
      {s && StatusIcon ? (
        <span className={cn("inline-flex items-center gap-1", s.className)}>
          <StatusIcon className="size-3" />
          {s.label}
        </span>
      ) : null}
    </div>
  )
}

/* ───────────────────────── ChatSystemMessage ───────────────────────── */

type ChatSystemMessageProps = React.ComponentProps<"div"> & {
  /** `divider` adds a rule on each side for date/section breaks. */
  variant?: "default" | "divider"
  /** Leading icon; wrap in `<Icon>` for consistent sizing. */
  icon?: React.ReactNode
}

function ChatSystemMessage({
  variant = "default",
  icon,
  children,
  className,
  ...props
}: ChatSystemMessageProps) {
  const content = (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      {icon}
      {children}
    </span>
  )
  if (variant === "divider") {
    return (
      <div
        data-slot="chat-system-message"
        data-variant="divider"
        className={cn("flex items-center gap-3 px-2", className)}
        {...props}
      >
        <Separator className="flex-1" />
        {content}
        <Separator className="flex-1" />
      </div>
    )
  }
  return (
    <div
      data-slot="chat-system-message"
      className={cn("flex justify-center px-2 py-1", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageMetadata,
  ChatSystemMessage,
  type ChatSender,
  type ChatDensity,
  type ChatStatus,
  type ChatMessageListProps,
  type ChatMessageProps,
  type ChatMessageBubbleProps,
  type ChatMessageMetadataProps,
  type ChatSystemMessageProps,
}
