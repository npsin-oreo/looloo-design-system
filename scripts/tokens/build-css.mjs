#!/usr/bin/env node
/**
 * build-css.mjs — compile the canonical token layer to CSS.
 *
 *   dist/tokens/primitive.css   :root --ll-* vars (namespaced; Tailwind v4's
 *                               default @theme owns --color-…, --text-…)
 *   dist/tokens/semantic.css    @theme axis re-points + :root shadcn-named
 *                               vars (--background, --primary, …) + new roles
 *                               (--surface-*, --focus-*, --status-*)
 *   dist/tokens/component.css   :root --button-*, --table-*, … (draft layer)
 *   dist/tokens/compat.css      legacy names for published consumers:
 *                               --tw-… and --brand-… alias canonical vars;
 *                               --rdx-… frozen literals (Radix was not
 *                               promoted to canonical — raw-only)
 *   dist/tokens/modes/*.css     .dark / [data-density=…] / [data-contrast=high]
 *   dist/themes/*.css           [data-theme=…] (PROPOSED scaffolds)
 *
 * dist/ is git-ignored build output. The legacy pipeline
 * (app/primitives.css + app/brand.css) stays authoritative until
 * `npm run tokens:diff` proves parity AND the consumer swap phase lands.
 *
 * Run: npm run tokens:build
 */
import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { loadTokens, cssValue, repoRoot, GENERATED_HEADER } from "./lib-tokens.mjs"
import { toOklch } from "../lib-oklch.mjs"

const { registry, overlays } = loadTokens()
const outTokens = join(repoRoot, "dist", "tokens")
mkdirSync(join(outTokens, "modes"), { recursive: true })
mkdirSync(join(repoRoot, "dist", "themes"), { recursive: true })

const line = (e) => `  ${e.cssVar}: ${cssValue(registry, e.token.$value)};`
const byLayer = (layer) => [...registry.values()].filter((e) => e.layer === layer)

/* ---------- primitive.css ---------- */
writeFileSync(
  join(outTokens, "primitive.css"),
  GENERATED_HEADER("build-css.mjs") +
    ":root {\n" + byLayer("primitive").map(line).join("\n") + "\n}\n"
)

/* ---------- semantic.css (+ base-theme axes from theme/neutral) ---------- */
// theme.neutral scalars → the axis var names app/brand.css ships today.
const AXIS_ROOT = {
  radius: "--radius",
  "motion.duration": "--duration-base",
  "motion.ease": "--ease-brand",
  "typography.weightHeading": "--weight-heading",
  "layout.container": "--container-max",
  "layout.section": "--space-section",
}
const AXIS_THEME = {
  "typography.leading": "--text-base--line-height",
  "typography.tracking": "--tracking-tight",
}
const neutral = Object.fromEntries(
  (overlays.theme.neutral?.entries ?? []).map((e) => [e.path, e.token.$value])
)
const themeBlock = Object.entries(AXIS_THEME)
  .filter(([p]) => neutral[p] != null)
  .map(([p, v]) => `  ${v}: ${neutral[p]};`)
const axisLines = Object.entries(AXIS_ROOT)
  .filter(([p]) => neutral[p] != null)
  .map(([p, v]) => `  ${v}: ${neutral[p]};`)
writeFileSync(
  join(outTokens, "semantic.css"),
  GENERATED_HEADER("build-css.mjs") +
    (themeBlock.length ? `@theme {\n${themeBlock.join("\n")}\n}\n\n` : "") +
    ":root {\n" +
    axisLines.join("\n") + "\n" +
    byLayer("semantic").map(line).join("\n") +
    "\n}\n"
)

/* ---------- component.css ---------- */
writeFileSync(
  join(outTokens, "component.css"),
  GENERATED_HEADER("build-css.mjs") +
    "/* Draft component layer — variants wire to these in the tokenization phase. */\n" +
    ":root {\n" + byLayer("component").map(line).join("\n") + "\n}\n"
)

/* ---------- compat.css (published consumer contract) ---------- */
const legacy = JSON.parse(
  readFileSync(join(repoRoot, "tokens", "raw", "legacy.tokens.json"), "utf8")
)
function compatLines(collKey, legacyPrefix, canonicalPrefix) {
  const lines = []
  for (const [fam, steps] of Object.entries(legacy[collKey] ?? {})) {
    if (!steps || typeof steps !== "object") continue
    const f = fam.toLowerCase().replace(/\s+/g, "-")
    const emit = (node, step) => {
      if (!(node && typeof node === "object" && node.$type === "color")) return
      const legacyVar = `--${legacyPrefix}-${f}${step ? `-${step}` : ""}`
      const canonical = registry.get(`color.${canonicalPrefix}${f}${step ? `.${step}` : ""}`)
      lines.push(
        canonical
          ? `  ${legacyVar}: var(${canonical.cssVar});`
          : `  ${legacyVar}: ${toOklch(node.$value)};` // frozen literal (not promoted)
      )
    }
    if ("$value" in steps) emit(steps, "")
    else for (const [step, node] of Object.entries(steps)) emit(node, step)
  }
  return lines
}
/* deprecated component-tier color names — thin aliases for one deprecation window
 * (the component color tier was collapsed into semantic; dropped at the next major) */
const deprecatedColors = JSON.parse(
  readFileSync(join(repoRoot, "tokens", "raw", "deprecated-component-colors.json"), "utf8")
).aliases
const deprecatedColorLines = Object.entries(deprecatedColors).map(
  ([oldVar, target]) => `  ${oldVar}: ${target === "currentColor" ? "currentColor" : `var(${target})`};`
)
writeFileSync(
  join(outTokens, "compat.css"),
  GENERATED_HEADER("build-css.mjs") +
    "/* Legacy primitive names — REQUIRED by published consumers whose\n" +
    " * ds-brand-build output references var(--tw-*) / var(--rdx-*) / var(--brand-*).\n" +
    " * tw/brand alias the canonical --ll-* layer; rdx is frozen at its legacy\n" +
    " * values (Radix palette was not promoted to canonical — zero repo consumers). */\n" +
    ":root {\n" +
    [
      ...compatLines("tw-colors/Mode 1", "tw", ""),
      ...compatLines("rdx-colors/light mode", "rdx", "rdx-not-promoted."), // no canonical match → literals
      ...compatLines("brand-color/Mode 1", "brand", "brand."),
    ].join("\n") +
    "\n}\n\n" +
    "/* DEPRECATED component color names (removed 2026-07-21, PR #33) — thin aliases to\n" +
    " * the semantic tier for ONE deprecation window. Do not use in new code; migrate to\n" +
    " * the target token. Dropped at the next major bump. Source of truth:\n" +
    " * tokens/raw/deprecated-component-colors.json. */\n" +
    ":root {\n" + deprecatedColorLines.join("\n") + "\n}\n"
)

/* ---------- modes ---------- */
const MODE_SELECTOR = {
  light: null, // base — semantic.css IS light
  dark: ".dark",
  compact: '[data-density="compact"]',
  comfortable: '[data-density="comfortable"]',
  "high-contrast": '[data-contrast="high"]',
}
for (const [name, selector] of Object.entries(MODE_SELECTOR)) {
  const overlay = overlays.mode[name]
  const file = join(outTokens, "modes", `${name}.css`)
  if (!selector || !overlay?.entries.length) {
    writeFileSync(
      file,
      GENERATED_HEADER("build-css.mjs") +
        `/* ${name}: ${!selector ? "base mode — values live in semantic.css" : "no overrides defined"}. */\n`
    )
    continue
  }
  const lines = []
  const skipped = []
  for (const { path, token } of overlay.entries) {
    const target = registry.get(path)
    if (!target) { skipped.push(path); continue }
    lines.push(`  ${target.cssVar}: ${cssValue(registry, token.$value)};`)
  }
  writeFileSync(
    file,
    GENERATED_HEADER("build-css.mjs") +
      (name !== "dark" ? "/* PROPOSED mode — nothing sets this selector yet (wired in Phase 4+). */\n" : "") +
      (skipped.length ? `/* skipped (unknown target path): ${skipped.join(", ")} */\n` : "") +
      `${selector} {\n${lines.join("\n")}\n}\n`
  )
}

/* ---------- themes ---------- */
for (const [name, overlay] of Object.entries(overlays.theme)) {
  const file = join(repoRoot, "dist", "themes", `${name}.css`)
  if (name === "neutral") {
    writeFileSync(
      file,
      GENERATED_HEADER("build-css.mjs") +
        "/* neutral: the base theme — its values ARE semantic.css; no overrides. */\n"
    )
    continue
  }
  const lines = []
  const skipped = []
  for (const { path, token } of overlay.entries) {
    const target = registry.get(path)
    if (!target) { skipped.push(path); continue }
    lines.push(`  ${target.cssVar}: ${cssValue(registry, token.$value)};`)
  }
  writeFileSync(
    file,
    GENERATED_HEADER("build-css.mjs") +
      (overlay.proposed
        ? "/* PROPOSED theme scaffold — values pending design sign-off; nothing sets this selector yet. */\n"
        : "/* Design-approved values. Applied when a product opts in via this selector. */\n") +
      (skipped.length ? `/* skipped (no canonical target yet): ${skipped.join(", ")} */\n` : "") +
      `[data-theme="${name}"] {\n${lines.join("\n")}\n}\n`
  )
}

console.log(
  `dist/tokens: primitive(${byLayer("primitive").length}) semantic(${byLayer("semantic").length}+${axisLines.length + themeBlock.length} axes) ` +
    `component(${byLayer("component").length}) + compat + ${Object.keys(MODE_SELECTOR).length} modes + ${Object.keys(overlays.theme).length} themes`
)
