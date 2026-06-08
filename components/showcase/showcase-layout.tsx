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

import {
  FOUNDATIONS_ROUTE,
  TIER_ICONS,
  TIER_ROUTES,
  TIERS,
} from "./sections"

const TOTAL = TIERS.reduce((n, t) => n + t.demos.length, 0)

function currentLabel(pathname: string) {
  const tier = TIERS.find((t) => TIER_ROUTES[t.id] === pathname)
  return tier?.label ?? "Foundations"
}

export function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <SidebarProvider>
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
              <SidebarGroupLabel>Foundations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === FOUNDATIONS_ROUTE}
                    >
                      <Link href={FOUNDATIONS_ROUTE}>
                        <Palette />
                        <span>Color tokens</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {TIERS.map((tier) => {
              const Icon = TIER_ICONS[tier.id] ?? Atom
              const route = TIER_ROUTES[tier.id]
              const onThisTier = pathname === route
              return (
                <SidebarGroup key={tier.id}>
                  <SidebarGroupLabel>
                    <Icon className="size-3.5" />
                    {tier.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {tier.demos.map((demo) => (
                        <SidebarMenuItem key={demo.id}>
                          <SidebarMenuButton asChild isActive={false}>
                            <Link
                              href={`${route}#${demo.id}`}
                              scroll={onThisTier}
                            >
                              <span>{demo.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
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
            <span className="font-semibold">{currentLabel(pathname)}</span>
            <Badge variant="secondary" className="ml-auto">
              {TOTAL} components
            </Badge>
          </header>

          <main className="flex flex-col gap-12 p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  )
}
