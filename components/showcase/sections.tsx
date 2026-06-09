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
import { brandColors, rdxColors, twColors } from "./palettes"
import { TOKEN_COVERAGE } from "./token-coverage"
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

// Figma text styles (Text-{size}/{weight}), synced 1:1 from the kit.
const WEIGHT_LABEL: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
}

const TEXT_STYLES: { name: string; size: number; lh: number; weight: number }[] =
  [
    { name: "Text-4xl/Semi Bold", size: 36, lh: 40, weight: 600 },
    { name: "Text-3xl/Bold", size: 30, lh: 36, weight: 700 },
    { name: "Text-2xl/Semi Bold", size: 24, lh: 32, weight: 600 },
    { name: "Text-lg/Semi Bold", size: 18, lh: 28, weight: 600 },
    { name: "Text-base/Semi Bold", size: 16, lh: 24, weight: 600 },
    { name: "Text-base/Medium", size: 16, lh: 24, weight: 500 },
    { name: "Text-base/Regular", size: 16, lh: 24, weight: 400 },
    { name: "Text-sm/Bold", size: 14, lh: 20, weight: 700 },
    { name: "Text-sm/Semi Bold", size: 14, lh: 20, weight: 600 },
    { name: "Text-sm/Medium", size: 14, lh: 20, weight: 500 },
    { name: "Text-sm/Regular", size: 14, lh: 20, weight: 400 },
    { name: "Text-xs/Semi Bold", size: 12, lh: 16, weight: 600 },
    { name: "Text-xs/Medium", size: 12, lh: 16, weight: 500 },
    { name: "Text-xs/Regular", size: 12, lh: 16, weight: 400 },
  ]

const RADII: { name: string; cls: string; px: string }[] = [
  { name: "sm", cls: "rounded-sm", px: "6" },
  { name: "md", cls: "rounded-md", px: "8" },
  { name: "lg", cls: "rounded-lg", px: "10" },
  { name: "xl", cls: "rounded-xl", px: "14" },
  { name: "2xl", cls: "rounded-2xl", px: "18" },
  { name: "3xl", cls: "rounded-3xl", px: "22" },
  { name: "4xl", cls: "rounded-4xl", px: "26" },
]

// Figma effect styles (Box Shadow/*), synced 1:1 from the kit.
const EFFECTS: { name: string; cls: string; value: string }[] = [
  { name: "shadow-xs", cls: "shadow-xs", value: "0 1px 2px 0 · 10%" },
  { name: "shadow-sm", cls: "shadow-sm", value: "0 1px 3px 0 · 10%" },
  { name: "shadow-md", cls: "shadow-md", value: "0 2px 4px -2px, 0 4px 6px -1px" },
  { name: "shadow-lg", cls: "shadow-lg", value: "0 4px 6px -4px, 0 10px 15px -3px" },
  { name: "Focus ring", cls: "shadow-focus", value: "0 0 0 3px · #A1A1A1 50%" },
]

const BORDERS: { name: string; cls: string }[] = [
  { name: "border", cls: "border" },
  { name: "border-2", cls: "border-2" },
  { name: "border-4", cls: "border-4" },
  { name: "border-8", cls: "border-8" },
]

function PaletteGrid({
  palette,
}: {
  palette: Record<string, Record<string, string>>
}) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(palette).map(([family, steps]) => (
        <div key={family} className="flex items-center gap-3">
          <code className="w-16 shrink-0 truncate text-xs">{family}</code>
          <div className="flex flex-1 gap-1">
            {Object.entries(steps).map(([step, hex]) => (
              <div
                key={step}
                title={`${family}${step ? `-${step}` : ""} · ${hex}`}
                className="h-8 flex-1 rounded-sm border"
                style={{ background: hex }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* Each foundation's content (without page chrome). */

function ColorContent() {
  return (
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
  )
}

function TypographyContent() {
  return (
    <div className="flex flex-col divide-y rounded-lg border">
      {TEXT_STYLES.map((t) => (
        <div
          key={t.name}
          className="flex items-baseline justify-between gap-4 p-4"
        >
          <span
            className="truncate"
            style={{
              fontSize: `${t.size}px`,
              lineHeight: `${t.lh}px`,
              fontWeight: t.weight,
            }}
          >
            Almost before we knew it
          </span>
          <span className="text-muted-foreground shrink-0 text-right text-xs">
            <code>{t.name}</code>
            <span className="block">
              {t.size} / {t.lh} · {WEIGHT_LABEL[t.weight]}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

function SpacingContent() {
  return (
    <div className="flex flex-col gap-2">
      {SPACING.map((n) => (
        <div key={n} className="flex items-center gap-4">
          <code className="text-muted-foreground w-12 shrink-0 text-xs">{n}</code>
          <div
            className="bg-primary h-3 rounded-sm"
            style={{ width: `${n * 4}px` }}
          />
          <span className="text-muted-foreground text-xs">{n * 4}px</span>
        </div>
      ))}
    </div>
  )
}

function RadiusContent() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {RADII.map((r) => (
        <div key={r.name} className="flex flex-col items-center gap-2">
          <div className={`bg-muted size-16 border ${r.cls} border-primary/40`} />
          <code className="text-xs">rounded-{r.name}</code>
          <span className="text-muted-foreground text-xs">{r.px}px</span>
        </div>
      ))}
    </div>
  )
}

function ElevationContent() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
      {EFFECTS.map((e) => (
        <div key={e.name} className="flex flex-col items-center gap-2 text-center">
          <div className={`bg-card size-16 rounded-lg ${e.cls}`} />
          <code className="text-xs">{e.name}</code>
          <span className="text-muted-foreground text-[11px]">{e.value}</span>
        </div>
      ))}
    </div>
  )
}

function BorderContent() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {BORDERS.map((b) => (
        <div key={b.name} className="flex flex-col items-center gap-2">
          <div className={`bg-card size-16 rounded-lg ${b.cls}`} />
          <code className="text-xs">{b.name}</code>
        </div>
      ))}
    </div>
  )
}

function CoverageContent() {
  const total = TOKEN_COVERAGE.reduce((n, c) => n + c.count, 0)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground max-w-2xl text-sm">
        Every collection in{" "}
        <code className="bg-muted rounded px-1 py-0.5 text-xs">tokens.json</code>{" "}
        (Figma export): {TOKEN_COVERAGE.length} collections,{" "}
        <strong className="text-foreground">{total}</strong> variables. Scale
        collections (margin, padding, gap, sizing…) are Tailwind utilities that
        alias into the <code>tokens</code> primitive scale — shown here resolved.
        Color collections live on the palette pages.
      </p>
      {TOKEN_COVERAGE.map((c) => (
        <div key={c.name} className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <code className="text-sm font-medium">{c.name}</code>
            <Badge variant="secondary">{c.count}</Badge>
            <span className="text-muted-foreground text-xs">{c.kind}</span>
          </div>
          {c.kind === "scale" ? (
            <div className="flex flex-wrap gap-1">
              {c.values.map((v) => (
                <code
                  key={v}
                  className="bg-muted rounded px-1.5 py-0.5 text-xs"
                >
                  {v}
                </code>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">
              {c.count} colors — see the Tailwind / Radix / Brand palette pages
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export type Foundation = {
  id: string
  label: string
  description: string
  render: () => React.ReactNode
}

export const FOUNDATIONS: Foundation[] = [
  {
    id: "color",
    label: "Color",
    description:
      "Semantic tokens from the shadcn-ui set, grouped by role. Light mode shown.",
    render: () => <ColorContent />,
  },
  {
    id: "tailwind",
    label: "Tailwind palette",
    description:
      "Tier-1 primitives (tw-colors). Hover a swatch for its hex. Semantic tokens alias into these.",
    render: () => <PaletteGrid palette={twColors} />,
  },
  {
    id: "radix",
    label: "Radix palette",
    description:
      "Tier-1 primitives (rdx-colors), steps 1–12. Hover a swatch for its hex.",
    render: () => <PaletteGrid palette={rdxColors} />,
  },
  {
    id: "brand",
    label: "Brand palette",
    description:
      "Brand-color primitives (primary + secondary ramps) from the Figma kit. Hover a swatch for its hex.",
    render: () => <PaletteGrid palette={brandColors} />,
  },
  {
    id: "typography",
    label: "Typography",
    description:
      "Figma text styles (Text-{size}/{weight}) — exact size / line-height / weight, in Google Sans.",
    render: () => <TypographyContent />,
  },
  {
    id: "spacing",
    label: "Spacing",
    description:
      "Tailwind v4 base unit = 4px. Every p / m / gap / size step is n × 4px.",
    render: () => <SpacingContent />,
  },
  {
    id: "radius",
    label: "Radius",
    description:
      "calc() radius scale off --radius. --radius (default) = rounded-lg = 10px.",
    render: () => <RadiusContent />,
  },
  {
    id: "elevation",
    label: "Elevation",
    description:
      "Figma effect styles (Box Shadow/*), synced 1:1 — every layer is black @ 10%, plus the Focus ring.",
    render: () => <ElevationContent />,
  },
  {
    id: "border",
    label: "Border width",
    description: "Border widths from the --border token color.",
    render: () => <BorderContent />,
  },
  {
    id: "coverage",
    label: "All tokens",
    description:
      "Full coverage of every tokens.json collection — counts + resolved values. Nothing hidden.",
    render: () => <CoverageContent />,
  },
]

export const FOUNDATIONS_ROUTE_BASE = "/foundations"

export function findFoundation(id: string): Foundation | undefined {
  return FOUNDATIONS.find((f) => f.id === id)
}

export function FoundationsOverview() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight">Foundations</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          The design tokens behind every component — synced 1:1 from{" "}
          <code className="bg-muted rounded px-1 py-0.5 text-xs">tokens.json</code>{" "}
          (Figma export). All swatches and samples read the live CSS variables.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FOUNDATIONS.map((f) => (
          <Link
            key={f.id}
            href={`${FOUNDATIONS_ROUTE_BASE}/${f.id}`}
            className="hover:bg-accent flex flex-col gap-1 rounded-lg border p-4 transition-colors"
          >
            <span className="font-medium">{f.label}</span>
            <span className="text-muted-foreground text-sm">{f.description}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function FoundationView({ foundation }: { foundation: Foundation }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Foundations
        </span>
        <div className="flex items-center gap-2">
          <Palette className="size-5" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {foundation.label}
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">
          {foundation.description}
        </p>
      </div>
      {foundation.render()}
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

/** kebab data-slot → PascalCase component name (card-header → CardHeader). */
function slotToName(slot: string) {
  return slot
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

type SlotNode = { name: string; children: SlotNode[] }

/** Walk a DOM subtree, building a tree of [data-slot] elements (skipping
 *  plain wrappers by hoisting their slotted descendants). */
function buildSlotTree(el: Element): SlotNode[] {
  const out: SlotNode[] = []
  for (const child of Array.from(el.children)) {
    const slot = child.getAttribute("data-slot")
    const kids = buildSlotTree(child)
    if (slot) out.push({ name: slotToName(slot), children: kids })
    else out.push(...kids)
  }
  return out
}

function TreeLines({
  nodes,
  prefix = "",
}: {
  nodes: SlotNode[]
  prefix?: string
}) {
  return (
    <>
      {nodes.map((node, i) => {
        const last = i === nodes.length - 1
        return (
          <React.Fragment key={`${prefix}-${node.name}-${i}`}>
            <div className="whitespace-pre leading-6">
              <span className="text-muted-foreground">
                {prefix}
                {last ? "└─ " : "├─ "}
              </span>
              <span className="text-foreground">{`<${node.name} />`}</span>
            </div>
            {node.children.length > 0 ? (
              <TreeLines
                nodes={node.children}
                prefix={`${prefix}${last ? "   " : "│  "}`}
              />
            ) : null}
          </React.Fragment>
        )
      })}
    </>
  )
}

function AnatomyTree({ node }: { node: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [tree, setTree] = React.useState<SlotNode[]>([])

  React.useEffect(() => {
    if (ref.current) setTree(buildSlotTree(ref.current))
  }, [])

  return (
    <div className="rounded-lg border">
      {/* hidden mount used only to read the rendered data-slot structure */}
      <div ref={ref} className="hidden" aria-hidden>
        {node}
      </div>
      <div className="overflow-x-auto p-4 font-mono text-sm">
        {tree.length > 0 ? (
          <TreeLines nodes={tree} />
        ) : (
          <p className="text-muted-foreground">
            No nested parts (single element, or content renders in a portal).
          </p>
        )}
      </div>
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
          <TabsTrigger value="tree">Tree</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="flex min-h-[220px] flex-wrap items-start gap-4 rounded-lg border p-8">
            {demo.node}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={demo.code} />
        </TabsContent>
        <TabsContent value="tree">
          <AnatomyTree node={demo.node} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
