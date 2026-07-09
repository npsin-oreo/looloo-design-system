"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"

type ThumbnailProps = Omit<React.ComponentProps<"div">, "children"> & {
  src?: string
  alt?: string
  /** Width / height ratio of the tile. @default 1 (square) */
  ratio?: number
  /** Shown when `src` is missing or fails to load. */
  fallback?: React.ReactNode
}

function Thumbnail({
  src,
  alt = "",
  ratio = 1,
  fallback,
  className,
  style,
  ...props
}: ThumbnailProps) {
  const [failed, setFailed] = React.useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <div
      data-slot="thumbnail"
      style={{ aspectRatio: ratio, ...style }}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground",
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          data-slot="thumbnail-image"
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <span data-slot="thumbnail-fallback" className="text-xs">
          {fallback}
        </span>
      )}
    </div>
  )
}

export { Thumbnail, type ThumbnailProps }
