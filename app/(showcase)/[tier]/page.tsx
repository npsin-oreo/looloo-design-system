"use client"

import { notFound, useParams } from "next/navigation"

import { findTier, TierOverview } from "@/components/showcase/sections"

export default function TierPage() {
  const { tier } = useParams<{ tier: string }>()
  const found = findTier(tier)
  if (!found) notFound()
  return <TierOverview tier={found} />
}
