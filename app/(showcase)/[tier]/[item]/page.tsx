"use client"

import { notFound, useParams } from "next/navigation"

import { ComponentView, findDemo } from "@/components/showcase/sections"

export default function ComponentPage() {
  const { tier, item } = useParams<{ tier: string; item: string }>()
  const demo = findDemo(tier, item)
  if (!demo) notFound()
  return <ComponentView tierId={tier} demo={demo} />
}
