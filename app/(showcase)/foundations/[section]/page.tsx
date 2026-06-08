"use client"

import { notFound, useParams } from "next/navigation"

import { findFoundation, FoundationView } from "@/components/showcase/sections"

export default function FoundationPage() {
  const { section } = useParams<{ section: string }>()
  const foundation = findFoundation(section)
  if (!foundation) notFound()
  return <FoundationView foundation={foundation} />
}
