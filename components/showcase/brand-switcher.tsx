"use client"

import { Palette } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useBrand } from "./brand-context"
import { PREVIEW_BRANDS } from "./brands"

export function BrandSwitcher() {
  const { brandId, setBrandId } = useBrand()
  return (
    <Select value={brandId} onValueChange={setBrandId}>
      <SelectTrigger size="sm" aria-label="Preview brand" className="gap-2">
        <Palette className="size-4 shrink-0" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {PREVIEW_BRANDS.map((brand) => (
          <SelectItem key={brand.id} value={brand.id}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
