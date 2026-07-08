import type { ThemeConfig } from "../theme-types"

/**
 * Healthcare theme — PROPOSED SCAFFOLD for high-error-cost products
 * (medical flows, operational tools). Bias per the v2 spec: high readability,
 * comfortable density, clear status colors, strong focus states, calm
 * surfaces, less decorative motion. Values pending design.
 */
const healthcare: ThemeConfig = {
  name: "healthcare",
  extends: "neutral",
  status: "proposed",
  density: "comfortable",
  overrides: {
    "focus.ring.width": "4px",
  },
}

export default healthcare
