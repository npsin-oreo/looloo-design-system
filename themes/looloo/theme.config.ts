import type { ThemeConfig } from "../theme-types"

/**
 * LOOLOO product brand theme — PROPOSED SCAFFOLD.
 *
 * Every override below is a PLACEHOLDER pointing at the brand ramps that
 * already exist in the Figma export (tokens/primitive/color.json →
 * color.brand.*). The actual brand direction is a design decision that has
 * not been made. Today the real brand mechanism is brand.config.json on a
 * brand branch.
 */
const looloo: ThemeConfig = {
  name: "looloo",
  extends: "neutral",
  status: "proposed",
  overrides: {
    "color.primary": "{color.brand.cerulean-blue.500}",
    "color.accent": "{color.brand.coral.500}",
  },
}

export default looloo
