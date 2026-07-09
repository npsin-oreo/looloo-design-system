import * as React from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "../../../lib/utils"
import { Blockquote } from "../blockquote"
import { CodeBlock } from "../code-block"
import { Separator } from "../separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table"

const components: Components = {
  h1: ({ node, ...props }) => <h1 className="mt-6 mb-3 text-2xl font-semibold first:mt-0" {...props} />,
  h2: ({ node, ...props }) => <h2 className="mt-6 mb-3 text-xl font-semibold first:mt-0" {...props} />,
  h3: ({ node, ...props }) => <h3 className="mt-5 mb-2 text-lg font-semibold first:mt-0" {...props} />,
  h4: ({ node, ...props }) => <h4 className="mt-4 mb-2 text-base font-semibold first:mt-0" {...props} />,
  p: ({ node, ...props }) => <p className="my-3 first:mt-0 last:mb-0" {...props} />,
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-primary underline underline-offset-4"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => <ul className="my-3 ml-6 list-disc [&>li]:mt-1" {...props} />,
  ol: ({ node, ...props }) => <ol className="my-3 ml-6 list-decimal [&>li]:mt-1" {...props} />,
  blockquote: ({ node, ...props }) => <Blockquote className="my-4" {...props} />,
  hr: () => <Separator className="my-4" />,
  table: ({ node, ...props }) => (
    <div className="my-4 overflow-x-auto rounded-md border">
      <Table {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, ...props }) => <TableHead {...props} />,
  td: ({ node, ...props }) => <TableCell {...props} />,
  // CodeBlock renders its own <pre>; unwrap Markdown's so it isn't double-wrapped.
  pre: ({ children }) => <>{children}</>,
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "")
    const text = String(children ?? "")
    const isBlock = Boolean(match) || text.includes("\n")
    if (!isBlock) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props}>
          {children}
        </code>
      )
    }
    return <CodeBlock className="my-4" code={text.replace(/\n$/, "")} lang={match?.[1]} />
  },
}

type MarkdownProps = {
  /** Markdown source string. Safe to update incrementally while streaming. */
  children: string
  className?: string
}

function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      data-slot="markdown"
      className={cn("text-sm leading-relaxed break-words", className)}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { Markdown, type MarkdownProps }
