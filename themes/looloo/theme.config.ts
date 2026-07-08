import type { ThemeConfig } from "../theme-types"

/**
 * LOOLOO product brand theme — DESIGN SIGNED OFF 2026-07-08.
 *
 * primary #60CFCB (= brand secondary.300 ramp) with dark foreground
 * (10.64:1; white would fail at 1.86:1); accent #0B2846 deep navy with white
 * foreground (14.93:1). Compiled to dist/themes/looloo.css; not applied at
 * runtime until a product opts in via [data-theme="looloo"].
 */
const looloo: ThemeConfig = {
  name: "looloo",
  extends: "neutral",
  status: "active",
  overrides: {
    "color.primary": "{color.brand.secondary.300}",
    "color.primary-foreground": "{color.neutral.950}",
    "color.accent": "oklch(0.273 0.066 252.129)",
    "color.accent-foreground": "{color.white}",
  },
}

export default looloo
