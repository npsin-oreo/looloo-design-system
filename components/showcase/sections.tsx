"use client"

import * as React from "react"
import Link from "next/link"
import { Atom, Boxes, Check, Combine, Copy, Palette } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { atoms } from "./atoms"
import { molecules } from "./molecules"
import { organisms } from "./organisms"
import type { Demo, Tier } from "./types"

export const TIERS: Tier[] = [atoms, molecules, organisms]

/** Route prefix each tier renders on. Foundations (tokens) lives at "/". */
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

export function findTier(tierId: string): Tier | undefined {
  return TIERS.find((t) => t.id === tierId)
}

export function findDemo(tierId: string, demoId: string): Demo | undefined {
  return findTier(tierId)?.demos.find((d) => d.id === demoId)
}

/* ---------------------------------------------------------------- Foundations */

const COLOR_GROUPS: { label: string; tokens: string[] }[] = [
  {
    label: "Base",
    tokens: [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
    ],
  },
  {
    label: "Brand & status",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
    ],
  },
  { label: "UI", tokens: ["border", "input", "ring"] },
  { label: "Chart", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"] },
  {
    label: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
]

const SPACING = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]

const TYPE_SCALE: { name: string; cls: string; meta: string }[] = [
  { name: "4xl", cls: "text-4xl font-semibold", meta: "36 / 40 · SemiBold" },
  { name: "3xl", cls: "text-3xl font-bold", meta: "30 / 36 · Bold" },
  { name: "2xl", cls: "text-2xl font-semibold", meta: "24 / 32 · SemiBold" },
  { name: "xl", cls: "text-xl font-medium", meta: "20 / 28 · Medium" },
  { name: "lg", cls: "text-lg font-medium", meta: "18 / 28 · Medium" },
  { name: "base", cls: "text-base", meta: "16 / 24 · Regular" },
  { name: "sm", cls: "text-sm", meta: "14 / 20 · Regular" },
  { name: "xs", cls: "text-xs", meta: "12 / 16 · Regular" },
]

const RADII: { name: string; cls: string; px: string }[] = [
  { name: "xs", cls: "rounded-xs", px: "2" },
  { name: "sm", cls: "rounded-sm", px: "4" },
  { name: "md", cls: "rounded-md", px: "6" },
  { name: "lg", cls: "rounded-lg", px: "8" },
  { name: "xl", cls: "rounded-xl", px: "12" },
  { name: "2xl", cls: "rounded-2xl", px: "16" },
  { name: "3xl", cls: "rounded-3xl", px: "24" },
  { name: "4xl", cls: "rounded-4xl", px: "32" },
]

const SHADOWS = ["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl"]

const BORDERS: { name: string; cls: string }[] = [
  { name: "border", cls: "border" },
  { name: "border-2", cls: "border-2" },
  { name: "border-4", cls: "border-4" },
  { name: "border-8", cls: "border-8" },
]

function FoundationBlock({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Atom
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="flex scroll-mt-20 flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon className="size-5" />
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">{description}</p>
      </div>
      {children}
    </section>
  )
}

export function FoundationsSection() {
  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Foundations</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          The design tokens behind every component — synced 1:1 from{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">tokens.json</code>{" "}
          (Figma export). All swatches and samples read the live CSS variables.
        </p>
      </header>

      {/* Colors */}
      <FoundationBlock
        icon={Palette}
        title="Color"
        description="Semantic tokens from the shadcn-ui set, grouped by role. Light mode shown."
      >
        <div className="flex flex-col gap-6">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {group.label}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {group.tokens.map((token) => (
                  <div
                    key={token}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div
                      className="size-9 shrink-0 rounded-md border"
                      style={{ background: `var(--${token})` }}
                    />
                    <code className="truncate text-xs">--{token}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FoundationBlock>

      {/* Typography */}
      <FoundationBlock
        icon={Palette}
        title="Typography"
        description="Type scale rendered in the kit font (Google Sans). size / line-height · weight."
      >
        <div className="flex flex-col divide-y rounded-lg border">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.name}
              className="flex items-baseline justify-between gap-4 p-4"
            >
              <span className={`${t.cls} truncate`}>Almost before we knew it</span>
              <span className="text-muted-foreground shrink-0 text-right text-xs">
                <code>text-{t.name}</code>
                <span className="block">{t.meta}</span>
              </span>
            </div>
          ))}
        </div>
      </FoundationBlock>

      {/* Spacing */}
      <FoundationBlock
        icon={Palette}
        title="Spacing"
        description="Tailwind v4 base unit = 4px. Every p / m / gap / size step is n × 4px."
      >
        <div className="flex flex-col gap-2">
          {SPACING.map((n) => (
            <div key={n} className="flex items-center gap-4">
              <code className="text-muted-foreground w-12 shrink-0 text-xs">
                {n}
              </code>
              <div
                className="bg-primary h-3 rounded-sm"
                style={{ width: `${n * 4}px` }}
              />
              <span className="text-muted-foreground text-xs">{n * 4}px</span>
            </div>
          ))}
        </div>
      </FoundationBlock>

      {/* Radius */}
      <FoundationBlock
        icon={Palette}
        title="Radius"
        description="Tailwind v4 static radius scale. --radius (default) = rounded-lg = 8px."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RADII.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className={`bg-muted size-16 border ${r.cls} border-primary/40`}
              />
              <code className="text-xs">rounded-{r.name}</code>
              <span className="text-muted-foreground text-xs">{r.px}px</span>
            </div>
          ))}
        </div>
      </FoundationBlock>

      {/* Shadow */}
      <FoundationBlock
        icon={Palette}
        title="Elevation"
        description="shadow-xs is the kit override (10% alpha); the rest are Tailwind v4 defaults."
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {SHADOWS.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`bg-card size-16 rounded-lg ${s}`} />
              <code className="text-xs">{s}</code>
            </div>
          ))}
        </div>
      </FoundationBlock>

      {/* Border */}
      <FoundationBlock
        icon={Palette}
        title="Border width"
        description="Border widths from the --border token color."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BORDERS.map((b) => (
            <div key={b.name} className="flex flex-col items-center gap-2">
              <div className={`bg-card size-16 rounded-lg ${b.cls}`} />
              <code className="text-xs">{b.name}</code>
            </div>
          ))}
        </div>
      </FoundationBlock>
    </div>
  )
}

/* -------------------------------------------------------------- Tier overview */

export function TierOverview({ tier }: { tier: Tier }) {
  const Icon = TIER_ICONS[tier.id] ?? Atom
  const route = TIER_ROUTES[tier.id]
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Icon className="size-5" />
          <h1 className="text-2xl font-semibold tracking-tight">{tier.label}</h1>
          <Badge variant="secondary">{tier.demos.length}</Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">{tier.blurb}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tier.demos.map((demo) => (
          <Link
            key={demo.id}
            href={`${route}/${demo.id}`}
            className="hover:bg-accent flex flex-col gap-1 rounded-lg border p-4 transition-colors"
          >
            <span className="font-medium">{demo.title}</span>
            <span className="text-muted-foreground text-sm">
              {demo.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------- Component view */

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10"
        onClick={() => {
          navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
      <pre className="bg-muted overflow-x-auto rounded-lg border p-4 text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}

export function ComponentView({
  tierId,
  demo,
}: {
  tierId: string
  demo: Demo
}) {
  const tier = findTier(tierId)
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        {tier ? (
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            {tier.label}
          </span>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight">{demo.title}</h1>
        {demo.description ? (
          <p className="text-muted-foreground text-sm">{demo.description}</p>
        ) : null}
      </div>

      <Tabs defaultValue="preview" className="gap-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="flex min-h-[220px] flex-wrap items-start gap-4 rounded-lg border p-8">
            {demo.node}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={demo.code} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
