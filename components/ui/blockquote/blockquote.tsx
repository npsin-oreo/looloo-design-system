import * as React from "react"

import { cn } from "../../../lib/utils"

function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="blockquote"
      className={cn(
        "border-l-2 border-border pl-6 text-foreground italic [&>*+*]:mt-2",
        className
      )}
      {...props}
    />
  )
}

function BlockquoteCite({ className, ...props }: React.ComponentProps<"cite">) {
  return (
    <cite
      data-slot="blockquote-cite"
      className={cn("block text-sm text-muted-foreground not-italic", className)}
      {...props}
    />
  )
}

export { Blockquote, BlockquoteCite }
