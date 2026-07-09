"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import {
  ArrowUp,
  Check,
  CircleCheck,
  Clock,
  Mic,
  Square,
  TriangleAlert,
} from "../../../icons/icon-registry"
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

/* ───────────────────────── ChatComposer ───────────────────────── */

type ChatComposerContextValue = {
  value: string
  setValue: (v: string) => void
  submit: () => void
  onStop?: () => void
  isStopShown: boolean
  canSend: boolean
  disabled: boolean
  placeholder: string
  inputRef: React.RefObject<HTMLTextAreaElement | null>
}

const ComposerContext = React.createContext<ChatComposerContextValue | null>(null)

function useChatComposer() {
  const ctx = React.useContext(ComposerContext)
  if (!ctx) throw new Error("Chat composer parts must be used within <ChatComposer>.")
  return ctx
}

type ChatComposerProps = Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange" | "defaultValue"
> & {
  /** Controlled input value. Pair with `onValueChange`. */
  value?: string
  /** Initial value for the uncontrolled variant. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Fired on submit with the current value. Uncontrolled input clears after. */
  onSubmit?: (value: string) => void
  /** Fired when the stop button is pressed during generation. */
  onStop?: () => void
  /** Show the stop button instead of send (assistant is generating). */
  isStopShown?: boolean
  placeholder?: string
  disabled?: boolean
  /** Slot above the input row. */
  header?: React.ReactNode
  /** Slot below the input row. */
  footer?: React.ReactNode
  /** Controls placed left of the send button (e.g. ChatDictationButton). */
  sendActions?: React.ReactNode
}

function ChatComposer({
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  isStopShown = false,
  placeholder = "Type a message...",
  disabled = false,
  header,
  footer,
  sendActions,
  children,
  className,
  ...props
}: ChatComposerProps) {
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null)
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  const submit = React.useCallback(() => {
    const trimmed = current.trim()
    if (disabled || isStopShown || !trimmed) return
    onSubmit?.(current)
    if (!isControlled) setInternalValue("")
  }, [current, disabled, isStopShown, onSubmit, isControlled])

  const ctx = React.useMemo<ChatComposerContextValue>(
    () => ({
      value: current,
      setValue,
      submit,
      onStop,
      isStopShown,
      canSend: !disabled && current.trim().length > 0,
      disabled,
      placeholder,
      inputRef,
    }),
    [current, setValue, submit, onStop, isStopShown, disabled, placeholder]
  )

  return (
    <ComposerContext.Provider value={ctx}>
      <form
        data-slot="chat-composer"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={cn(
          "flex flex-col gap-2 rounded-2xl border bg-background p-2 shadow-xs focus-within:ring-1 focus-within:ring-ring",
          disabled && "opacity-60",
          className
        )}
        {...props}
      >
        {header}
        <div className="flex items-end gap-2">
          <div className="flex-1">{children ?? <ChatComposerInput />}</div>
          <div className="flex items-center gap-1">
            {sendActions}
            <ChatSendButton />
          </div>
        </div>
        {footer}
      </form>
    </ComposerContext.Provider>
  )
}

/* ───────────────────────── ChatComposerInput ───────────────────────── */

type ChatComposerInputProps = Omit<
  React.ComponentProps<"textarea">,
  "value" | "onChange" | "disabled"
> & {
  /** Visible rows before the input scrolls. @default 8 */
  maxRows?: number
}

function ChatComposerInput({
  maxRows = 8,
  className,
  onKeyDown,
  ...props
}: ChatComposerInputProps) {
  const ctx = useChatComposer()
  const ref = ctx.inputRef

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    const max = lineHeight * maxRows
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
    el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden"
  }, [ctx.value, maxRows, ref])

  return (
    <textarea
      ref={ref}
      data-slot="chat-composer-input"
      rows={1}
      value={ctx.value}
      disabled={ctx.disabled}
      placeholder={ctx.placeholder}
      onChange={(e) => ctx.setValue(e.target.value)}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault()
          ctx.submit()
        }
      }}
      className={cn(
        "w-full resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

/* ───────────────────────── ChatSendButton ───────────────────────── */

type ChatSendButtonProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  isStopShown?: boolean
  onSend?: () => void
  onStop?: () => void
  size?: "sm" | "md"
}

function ChatSendButton({
  isStopShown,
  disabled,
  onSend,
  onStop,
  size = "md",
  className,
  ...props
}: ChatSendButtonProps) {
  const ctx = useChatComposer()
  const stop = isStopShown ?? ctx.isStopShown
  const isDisabled = disabled ?? (stop ? false : !ctx.canSend)
  const Icon = stop ? Square : ArrowUp
  return (
    <button
      type="button"
      data-slot="chat-send-button"
      aria-label={stop ? "Stop generating" : "Send message"}
      disabled={isDisabled}
      onClick={() => {
        if (stop) (onStop ?? ctx.onStop)?.()
        else (onSend ?? ctx.submit)()
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "size-7" : "size-8",
        className
      )}
      {...props}
    >
      <Icon className={stop ? "size-3 fill-current" : "size-4"} />
    </button>
  )
}

/* ───────────────────────── useSpeechRecognition + ChatDictationButton ───────────────────────── */

type UseSpeechRecognitionReturn = {
  isSupported: boolean
  isListening: boolean
  transcript: string
  start: () => void
  stop: () => void
  toggle: () => void
}

function useSpeechRecognition(options?: {
  lang?: string
  onResult?: (text: string, isFinal: boolean) => void
}): UseSpeechRecognitionReturn {
  const { lang, onResult } = options ?? {}
  const onResultRef = React.useRef(onResult)
  onResultRef.current = onResult

  const Ctor =
    typeof window !== "undefined"
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition)
      : undefined
  const isSupported = Boolean(Ctor)

  const [isListening, setIsListening] = React.useState(false)
  const [transcript, setTranscript] = React.useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = React.useRef<any>(null)

  const stop = React.useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const start = React.useCallback(() => {
    if (!isSupported || isListening) return
    const recognition = new Ctor()
    recognition.lang = lang ?? (typeof navigator !== "undefined" ? navigator.language : "en-US")
    recognition.interimResults = true
    recognition.continuous = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let text = ""
      let isFinal = false
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript
        if (event.results[i].isFinal) isFinal = true
      }
      setTranscript(text)
      onResultRef.current?.(text, isFinal)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [Ctor, isSupported, isListening, lang])

  const toggle = React.useCallback(() => {
    if (isListening) stop()
    else start()
  }, [isListening, start, stop])

  React.useEffect(() => () => recognitionRef.current?.stop(), [])

  return { isSupported, isListening, transcript, start, stop, toggle }
}

type ChatDictationButtonProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  size?: "sm" | "md"
  /** Hide entirely when the browser lacks SpeechRecognition. @default true */
  isHiddenWhenUnsupported?: boolean
  label?: string
}

function ChatDictationButton({
  size = "md",
  isHiddenWhenUnsupported = true,
  label = "Dictate message",
  className,
  ...props
}: ChatDictationButtonProps) {
  const composer = React.useContext(ComposerContext)
  const dictation = useSpeechRecognition({
    onResult: (text, isFinal) => {
      if (isFinal && composer) composer.setValue((composer.value ? `${composer.value} ` : "") + text)
    },
  })

  if (!dictation.isSupported && isHiddenWhenUnsupported) return null

  return (
    <button
      type="button"
      data-slot="chat-dictation-button"
      aria-label={label}
      aria-pressed={dictation.isListening}
      data-listening={dictation.isListening || undefined}
      disabled={!dictation.isSupported}
      onClick={dictation.toggle}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[listening]:bg-primary data-[listening]:text-primary-foreground",
        size === "sm" ? "size-7" : "size-8",
        className
      )}
      {...props}
    >
      <Mic className="size-4" />
    </button>
  )
}

export {
  ChatMessageList,
  ChatMessage,
  ChatMessageBubble,
  ChatMessageMetadata,
  ChatSystemMessage,
  ChatComposer,
  ChatComposerInput,
  ChatSendButton,
  ChatDictationButton,
  useSpeechRecognition,
  type ChatSender,
  type ChatDensity,
  type ChatStatus,
  type ChatMessageListProps,
  type ChatMessageProps,
  type ChatMessageBubbleProps,
  type ChatMessageMetadataProps,
  type ChatSystemMessageProps,
  type ChatComposerProps,
  type ChatComposerInputProps,
  type ChatSendButtonProps,
  type ChatDictationButtonProps,
  type UseSpeechRecognitionReturn,
}
