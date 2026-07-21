import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance",
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn("flex max-w-sm flex-col items-center gap-2", className)}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-4",
      },
      /**
       * WHY it is empty — which is not the same question as what it looks like:
       * - neutral     → nothing here yet, or nothing matched (offer a way to fill it)
       * - success     → the user finished (do NOT offer a way to fill it)
       * - destructive → it failed to load (offer a retry, never a create)
       * - warning     → they are not allowed to see it (offer neither)
       */
      tone: {
        neutral:
          "data-[variant=icon]:bg-(--muted) data-[variant=icon]:text-(--foreground)",
        success:
          "data-[variant=icon]:bg-(--status-success-surface) data-[variant=icon]:text-(--status-success)",
        destructive:
          "data-[variant=icon]:bg-(--destructive-surface) data-[variant=icon]:text-(--destructive)",
        warning:
          "data-[variant=icon]:bg-(--status-warning-surface) data-[variant=icon]:text-(--status-warning-text)",
      },
    },
    defaultVariants: {
      variant: "default",
      tone: "neutral",
    },
  }
)

function EmptyMedia({
  className,
  variant = "default",
  tone = "neutral",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      data-tone={tone}
      className={cn(emptyMediaVariants({ variant, tone, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        "font-heading text-sm font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
