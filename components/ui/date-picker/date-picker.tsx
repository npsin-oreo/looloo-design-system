"use client"

import * as React from "react"
import { format } from "date-fns"

import { Calendar as CalendarIcon } from "../../../icons/icon-registry"
import { cn } from "../../../lib/utils"
import { Button } from "../button"
import { Calendar } from "../calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"

type DatePickerProps = {
  /** Controlled selected date. Pair with `onValueChange`. */
  value?: Date
  /** Initial date for the uncontrolled variant. */
  defaultValue?: Date
  /** Fires when the selection changes (both variants). */
  onValueChange?: (date: Date | undefined) => void
  /** Trigger label shown before a date is chosen. */
  placeholder?: string
  /** `date-fns` format string for the trigger label. */
  dateFormat?: string
  disabled?: boolean
  id?: string
  className?: string
}

function DatePicker({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Pick a date",
  dateFormat = "PPP",
  disabled,
  id,
  className,
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)
  const isControlled = value !== undefined || onValueChange !== undefined
  const date = isControlled ? value : internalDate

  const handleSelect = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) setInternalDate(next)
      onValueChange?.(next)
    },
    [isControlled, onValueChange]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          data-empty={!date}
          className={cn(
            "w-[240px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={handleSelect} autoFocus />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker, type DatePickerProps }
