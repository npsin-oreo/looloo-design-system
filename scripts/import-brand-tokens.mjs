#!/usr/bin/env node
/**
 * import-brand-tokens.mjs — map Kindmore's design-token export
 * (kindmore-tokens.json) onto the White-Label CSS token structure
 * (shadcn semantic names) and write brand.config.json.
 *
 * Kindmore's export has its own schema (Global Color palettes + nested
 * Alias Color semantics). White Label is the SOURCE OF TRUTH for the token
 * NAMES/roles; this script fills those roles with Kindmore's real values.
 *
 * Run:  node scripts/import-brand-tokens.mjs   (then npm run brand:build)
 */
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const src = JSON.parse(readFileSync(join(root, "kindmore-tokens.json"), "utf8"))
const config = JSON.parse(readFileSync(join(root, "brand.config.json"), "utf8"))

const palette = src["Global Color/Mode 1"]

/** Resolve a palette ref like "Cerulean Blue.500" or "Pure.White" → hex. */
function ref(r) {
  const i = r.lastIndexOf(".")
  const family = r.slice(0, i)
  const step = r.slice(i + 1)
  const hex = palette?.[family]?.[step]?.value
  if (!hex) throw new Error(`Unresolved palette ref: ${r}`)
  return hex.toLowerCase()
}

/** Resolve a map value: "@Family.Step" → palette hex; otherwise literal. */
function val(v) {
  return v.startsWith("@") ? ref(v.slice(1)) : v.toLowerCase()
}

// shadcn token (White Label) → Kindmore palette ref. LIGHT comes straight
// from Kindmore's light-only export.
const LIGHT = {
  background: "Pure.White",
  foreground: "Oslo Gray.950",
  card: "Pure.White",
  "card-foreground": "Oslo Gray.950",
  popover: "Pure.White",
  "popover-foreground": "Oslo Gray.950",
  primary: "Cerulean Blue.500", // Creation/Primary/Solid/Surface/Default
  "primary-foreground": "Cerulean Blue.50", // …/OnSurface/Default
  secondary: "Oslo Gray.100",
  "secondary-foreground": "Oslo Gray.950",
  muted: "Oslo Gray.100",
  "muted-foreground": "Oslo Gray.600", // Typography/Description
  accent: "Oslo Gray.100",
  "accent-foreground": "Oslo Gray.950",
  destructive: "Vivid Tangerine.500", // Creation/Error/Solid/Surface/Default
  border: "Oslo Gray.200", // Border/System/Default
  input: "Oslo Gray.200",
  ring: "Cerulean Blue.500", // brand focus ring
  "chart-1": "Cerulean Blue.500",
  "chart-2": "Anakiwa.500",
  "chart-3": "Fun Green.500",
  "chart-4": "Pizza.400",
  "chart-5": "Coral.400",
  sidebar: "Oslo Gray.50", // Background/System/DefaultDim
  "sidebar-foreground": "Oslo Gray.950",
  "sidebar-primary": "Cerulean Blue.500",
  "sidebar-primary-foreground": "Cerulean Blue.50",
  "sidebar-accent": "Oslo Gray.100",
  "sidebar-accent-foreground": "Oslo Gray.950",
  "sidebar-border": "Oslo Gray.200",
  "sidebar-ring": "Cerulean Blue.500",
}

// DARK: Kindmore's export is light-only. Per "follow White Label", dark
// SURFACES use White Label's neutral dark literals; BRAND/status tokens use
// Kindmore's palette (prefixed @).
const DARK = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  card: "#171717",
  "card-foreground": "#fafafa",
  popover: "#262626",
  "popover-foreground": "#fafafa",
  primary: "@Cerulean Blue.500",
  "primary-foreground": "@Cerulean Blue.50",
  secondary: "#262626",
  "secondary-foreground": "#fafafa",
  muted: "#262626",
  "muted-foreground": "#a3a3a3",
  accent: "#404040",
  "accent-foreground": "#fafafa",
  destructive: "@Vivid Tangerine.400",
  border: "#404040",
  input: "#171717",
  ring: "@Cerulean Blue.500",
  "chart-1": "@Cerulean Blue.500",
  "chart-2": "@Anakiwa.400",
  "chart-3": "@Fun Green.400",
  "chart-4": "@Pizza.400",
  "chart-5": "@Coral.300",
  sidebar: "#0a0a0a",
  "sidebar-foreground": "#fafafa",
  "sidebar-primary": "@Cerulean Blue.500",
  "sidebar-primary-foreground": "@Cerulean Blue.50",
  "sidebar-accent": "#262626",
  "sidebar-accent-foreground": "#fafafa",
  "sidebar-border": "#404040",
  "sidebar-ring": "@Cerulean Blue.500",
}

const light = Object.fromEntries(
  Object.entries(LIGHT).map(([k, v]) => [k, ref(v)])
)
const dark = Object.fromEntries(
  Object.entries(DARK).map(([k, v]) => [k, val(v)])
)

config.name = "Kindmore Clinic"
config.description =
  "Kindmore Clinic — mapped from kindmore-tokens.json onto the White-Label token structure. Font: Anuphan."
config.fonts = {
  sans: src["Typography/Mode 1"]?.Primitive?.Family?.UI?.value ?? "Anuphan",
  mono: "Geist Mono",
  note: "Anuphan bundled in app/fonts/ + wired in app/layout.tsx (--font-anuphan).",
}
// Merge over existing (preserves extras: background-color, semantic-*).
config.light = { ...config.light, ...light }
config.dark = { ...config.dark, ...dark }

writeFileSync(join(root, "brand.config.json"), JSON.stringify(config, null, 2) + "\n")
console.log(
  `✓ mapped Kindmore tokens → brand.config.json (${Object.keys(light).length} light + ${Object.keys(dark).length} dark). Run \`npm run brand:build\`.`
)
console.log(
  `  primary ${light.primary} · foreground ${light.foreground} · destructive ${light.destructive} · border ${light.border}`
)
