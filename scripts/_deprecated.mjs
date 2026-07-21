/**
 * _deprecated.mjs — shared deprecation banner for the LEGACY token pipeline.
 *
 * As of v1.0.0 the canonical token source is hand-authored `tokens/**`, compiled
 * by `scripts/tokens/*` (build-theme → tokens/theme/<brand>.json, then build-css).
 * The scripts that import this banner are the OLD pipeline (tokens.json /
 * brand.config → app/*.css + root token-contract.json). They still run for ONE
 * deprecation window so published `ds-brand-build` consumers keep working, and
 * are removed in the next major (Phase 6 of the RFC).
 *
 * See docs/rfc/retire-legacy-token-pipeline.md.
 */

/** Print a visible stderr banner. Non-fatal; the script continues to run. */
export function warnDeprecated({ script, replacement }) {
  const msg = [
    "",
    "  ⚠  DEPRECATED (since v1.0.0 · removed in the next major):",
    `     ${script}`,
    replacement ? `     → use instead: ${replacement}` : null,
    "     The token source is now hand-authored tokens/** (build-theme + build-css).",
    "     See docs/rfc/retire-legacy-token-pipeline.md",
    "",
  ]
    .filter(Boolean)
    .join("\n")
  console.warn(msg)
}
