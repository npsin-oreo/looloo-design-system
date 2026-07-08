import type { ThemeConfig } from "../theme-types"

/**
 * Neutral = the white-label base. Boring on purpose: default docs, new
 * prototypes, AI-generated screens before brand direction exists.
 *
 * It has NO overrides — the base values live in tokens/semantic/* (generated
 * from brand.config.json, which remains the live source until the token
 * pipeline swaps over).
 */
const neutral: ThemeConfig = {
  name: "neutral",
  status: "active",
  description:
    "White-label base theme. Values come from tokens/semantic/* / brand.config.json; this config exists so every theme has the same shape.",
  overrides: {},
}

export default neutral
