"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import { Button } from "../button"
import { Progress } from "../progress"
import { ArrowUp, CircleCheck, Loader2, OctagonX, X } from "../../../icons/icon-registry"

/**
 * The drop target. It is a drop zone BEFORE it is a button, which is why it is tall
 * and why its border is dashed — the dashes say "this space is waiting for something".
 */
function FileUploadDropzone({
  className,
  active = false,
  hint,
  ...props
}: React.ComponentProps<"div"> & { active?: boolean; hint?: React.ReactNode }) {
  return (
    <div
      data-slot="file-upload-dropzone"
      data-drag={active}
      className={cn(
        "flex flex-col items-center justify-center gap-(--file-upload-dropzone-gap) rounded-(--file-upload-dropzone-radius) border border-dashed border-(--border) px-(--file-upload-dropzone-padding-x) py-(--file-upload-dropzone-padding-y) text-center text-(length:--file-upload-dropzone-font-size)",
        "data-[drag=true]:border-(--primary) data-[drag=true]:bg-(--primary-surface)",
        className
      )}
      {...props}
    >
      <div className="flex size-(--file-upload-dropzone-icon-box-size) items-center justify-center rounded-(--file-upload-dropzone-icon-box-radius) bg-muted [&_svg]:size-(--file-upload-dropzone-icon-size)">
        <ArrowUp />
      </div>
      {props.children}
      {hint ? (
        <p className="text-(length:--file-upload-dropzone-hint-font-size) text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const fileRowMediaVariants = cva(
  "flex shrink-0 items-center justify-center rounded-(--file-upload-row-media-radius) size-(--file-upload-row-media-size) [&_svg]:size-4",
  {
    variants: {
      /** The TILE carries the state colour — never the whole row: a row of red for one
       *  failed upload buries the three that worked. */
      status: {
        uploading: "bg-(--muted) text-muted-foreground",
        success:
          "bg-(--status-success-surface) text-(--status-success)",
        error:
          "bg-(--destructive-surface) text-(--destructive)",
      },
    },
    defaultVariants: { status: "uploading" },
  }
)

function FileUploadRow({
  className,
  status = "uploading",
  name,
  message,
  progress,
  onRetry,
  onRemove,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof fileRowMediaVariants> & {
    name: string
    message?: string
    /** 0–100. Only meaningful while status === "uploading". */
    progress?: number
    onRetry?: () => void
    onRemove?: () => void
  }) {
  const Icon =
    status === "success" ? CircleCheck : status === "error" ? OctagonX : Loader2

  return (
    <div
      data-slot="file-upload-row"
      data-status={status}
      className={cn(
        "flex flex-col gap-(--file-upload-row-progress-gap) rounded-(--file-upload-row-radius) border p-(--file-upload-row-padding)",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-(--file-upload-row-gap)">
        <div className={cn(fileRowMediaVariants({ status }))}>
          <Icon className={status === "uploading" ? "animate-spin" : undefined} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-(length:--file-upload-row-title-font-size)">{name}</span>
          {message ? (
            <span className="text-(length:--file-upload-row-status-font-size) text-muted-foreground">
              {message}
            </span>
          ) : null}
        </div>

        {status === "error" && onRetry ? (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            ลองอีกครั้ง
          </Button>
        ) : null}

        {onRemove ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`ลบ ${name}`}
            className="text-(--destructive)"
            onClick={onRemove}
          >
            <X />
          </Button>
        ) : null}
      </div>

      {status === "uploading" && progress != null ? (
        <div className="flex items-center gap-(--file-upload-row-progress-gap)">
          <Progress value={progress} className="flex-1" />
          {/* the number is not decoration: a bar with no number cannot tell you whether a
              stalled upload is at 5% or 95% */}
          <span className="text-(length:--file-upload-row-status-font-size) tabular-nums text-muted-foreground">
            {progress}%
          </span>
        </div>
      ) : null}
    </div>
  )
}

function FileUpload({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload"
      className={cn("flex flex-col gap-(--file-upload-gap)", className)}
      {...props}
    />
  )
}

export { FileUpload, FileUploadDropzone, FileUploadRow, fileRowMediaVariants }
