"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import { X } from "../../../icons/icon-registry"

type TokenSize = "sm" | "md" | "lg"
type TokenVariant = "default" | "secondary" | "primary"

type TokenProps = Omit<React.ComponentProps<"span">, "onClick"> & {
  /** Text shown inside the token. */
  label: string
  /** @default "md" */
  size?: TokenSize
  /** @default "default" */
  variant?: TokenVariant
  /** Leading icon. */
  icon?: React.ReactNode
  /** Content after the label (before the remove button). */
  endContent?: React.ReactNode
  disabled?: boolean
  /** Renders a trailing remove (×) button when provided. */
  onRemove?: (e: React.MouseEvent) => void
  /** Makes the label an inline action button. */
  onClick?: (e: React.MouseEvent) => void
  /** Renders the label as a link. Takes precedence over `onClick`. */
  href?: string
}

const SIZE: Record<TokenSize, string> = {
  sm: "h-5 gap-1 px-1.5 text-xs [&_svg]:size-3",
  md: "h-6 gap-1.5 px-2 text-xs [&_svg]:size-3.5",
  lg: "h-7 gap-1.5 px-2.5 text-sm [&_svg]:size-4",
}

const VARIANT: Record<TokenVariant, string> = {
  default: "bg-muted text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  primary: "bg-primary text-primary-foreground",
}

function Token({
  label,
  size = "md",
  variant = "default",
  icon,
  endContent,
  disabled,
  onRemove,
  onClick,
  href,
  className,
  ...props
}: TokenProps) {
  const labelNode = href ? (
    <a
      href={href}
      className="truncate rounded-sm outline-none hover:underline focus-visible:shadow-(--focus-shadow)"
    >
      {label}
    </a>
  ) : onClick ? (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="truncate rounded-sm outline-none hover:underline focus-visible:shadow-(--focus-shadow) disabled:pointer-events-none"
    >
      {label}
    </button>
  ) : (
    <span className="truncate">{label}</span>
  )

  return (
    <span
      data-slot="token"
      data-disabled={disabled || undefined}
      className={cn(
        "inline-flex max-w-full items-center rounded-md font-medium select-none data-[disabled]:opacity-50",
        SIZE[size],
        VARIANT[variant],
        className
      )}
      {...props}
    >
      {icon}
      {labelNode}
      {endContent}
      {onRemove ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-mr-0.5 ml-0.5 inline-flex shrink-0 items-center justify-center rounded-full opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:shadow-(--focus-shadow) disabled:pointer-events-none"
        >
          <X />
        </button>
      ) : null}
    </span>
  )
}

export { Token, type TokenProps, type TokenSize, type TokenVariant }
