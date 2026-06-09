"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Atom, Palette } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { BrandProvider, useBrand } from "./brand-context"
import { BrandSwitcher } from "./brand-switcher"
import { brandVars, PREVIEW_BRANDS } from "./brands"
import { ModeToggle } from "./mode-toggle"

import {
  FOUNDATIONS,
  FOUNDATIONS_ROUTE,
  FOUNDATIONS_ROUTE_BASE,
  TIER_ICONS,
  TIER_ROUTES,
  TIERS,
} from "./sections"

const TOTAL = TIERS.reduce((n, t) => n + t.demos.length, 0)

function headerLabel(pathname: string) {
  if (pathname === FOUNDATIONS_ROUTE) return "Foundations"
  const foundation = FOUNDATIONS.find(
    (f) => pathname === `${FOUNDATIONS_ROUTE_BASE}/${f.id}`
  )
  if (foundation) return `Foundations / ${foundation.label}`
  for (const tier of TIERS) {
    const route = TIER_ROUTES[tier.id]
    if (pathname === route) return tier.label
    const demo = tier.demos.find((d) => pathname === `${route}/${d.id}`)
    if (demo) return `${tier.label} / ${demo.title}`
  }
  return "Component library"
}

function ShowcaseInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { brandId } = useBrand()
  const seed = PREVIEW_BRANDS.find((b) => b.id === brandId)?.seed ?? null

  return (
    <TooltipProvider>
      <SidebarProvider style={brandVars(seed)}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex flex-col gap-0.5 px-2 py-1">
              <span className="text-sm font-semibold">Design → Dev Handoff</span>
              <span className="text-muted-foreground text-xs">
                Atomic component library
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <Link href={FOUNDATIONS_ROUTE}>
                  <Palette className="size-3.5" />
                  Foundations
                </Link>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {FOUNDATIONS.map((f) => {
                    const href = `${FOUNDATIONS_ROUTE_BASE}/${f.id}`
                    return (
                      <SidebarMenuItem key={f.id}>
                        <SidebarMenuButton asChild isActive={pathname === href}>
                          <Link href={href}>
                            <span>{f.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {TIERS.map((tier) => {
              const Icon = TIER_ICONS[tier.id] ?? Atom
              const route = TIER_ROUTES[tier.id]
              return (
                <SidebarGroup key={tier.id}>
                  <SidebarGroupLabel asChild>
                    <Link href={route}>
                      <Icon className="size-3.5" />
                      {tier.label}
                    </Link>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {tier.demos.map((demo) => {
                        const href = `${route}/${demo.id}`
                        return (
                          <SidebarMenuItem key={demo.id}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === href}
                            >
                              <Link href={href}>
                                <span>{demo.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              )
            })}
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
            <span className="font-semibold">{headerLabel(pathname)}</span>
            <Badge variant="secondary" className="ml-auto">
              {TOTAL} components
            </Badge>
            <BrandSwitcher />
            <ModeToggle />
          </header>

          <main className="flex flex-col gap-12 p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  )
}

export function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider>
      <ShowcaseInner>{children}</ShowcaseInner>
    </BrandProvider>
  )
}
