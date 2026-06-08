"use client"

import { Atom, Boxes, Combine, Palette } from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { atoms } from "./atoms"
import { molecules } from "./molecules"
import { organisms } from "./organisms"
import type { Demo, Tier } from "./types"

export const TIERS: Tier[] = [atoms, molecules, organisms]

/** Route each tier renders on. Foundations (tokens) lives at "/". */
export const TIER_ROUTES: Record<string, string> = {
  atoms: "/atoms",
  molecules: "/molecules",
  organisms: "/organisms",
}

export const FOUNDATIONS_ROUTE = "/"

export const TIER_ICONS: Record<string, typeof Atom> = {
  atoms: Atom,
  molecules: Combine,
  organisms: Boxes,
}

const SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "card",
  "popover",
  "sidebar",
  "ring",
] as const

function DemoCard({ demo }: { demo: Demo }) {
  return (
    <div
      id={demo.id}
      className="flex scroll-mt-20 flex-col gap-4 rounded-lg border p-5"
    >
      <div className="flex flex-col gap-1">
        <h3 className="font-medium">{demo.title}</h3>
        {demo.description ? (
          <p className="text-muted-foreground text-sm">{demo.description}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-start gap-4">{demo.node}</div>
    </div>
  )
}

export function TierSection({ tier }: { tier: Tier }) {
  const Icon = TIER_ICONS[tier.id] ?? Atom
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon className="size-5" />
          <h1 className="text-2xl font-semibold tracking-tight">{tier.label}</h1>
          <Badge variant="secondary">{tier.demos.length}</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">{tier.blurb}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {tier.demos.map((demo) => (
          <DemoCard key={demo.id} demo={demo} />
        ))}
      </div>
    </section>
  )
}

export function FoundationsSection() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Component library &amp; design tokens
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          shadcn/ui components rendered with tokens synced 1:1 from{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">tokens.json</code>{" "}
          (Figma export), organized by{" "}
          <strong className="text-foreground">Atomic Design</strong>. Pick a tier
          in the sidebar — Atoms, Molecules, or Organisms.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Palette className="size-5" />
            <h2 className="text-xl font-semibold tracking-tight">Color tokens</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Semantic tokens from the <code>shadcn-ui</code> set. Swatches read the
            live CSS variables.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {SEMANTIC_TOKENS.map((token) => (
            <div
              key={token}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div
                className="size-9 shrink-0 rounded-md border"
                style={{ background: `var(--${token})` }}
              />
              <code className="text-xs">--{token}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
