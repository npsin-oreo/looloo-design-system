/**
 * Shared types for themes/<name>/theme.config.ts (DS v2 scaffold).
 *
 * Status: structure-only. Nothing imports these configs at runtime yet — the
 * live brand mechanism is the theme overlay: brand.config.json / brands/<name>.config.json
 * → `npm run tokens:theme` → tokens/theme/<name>.json → build-css. The token build
 * pipeline will compile these configs into dist/themes/<name>.css in a later phase.
 */
export interface ThemeConfig {
  name: string
  /** Base theme this one layers on top of. Only "neutral" exists today. */
  extends?: "neutral"
  status: "active" | "proposed"
  /** Default density mode (pairs with tokens/mode/{compact,comfortable}.json). */
  density?: "compact" | "comfortable"
  description?: string
  /**
   * Canonical token path → value or `{alias}` into tokens/*.
   * Themes override semantic/component tokens — never component source.
   */
  overrides: Record<string, string>
}
