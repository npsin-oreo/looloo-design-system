// Storybook-only browser stub for `@/lib/design-tokens`.
//
// The real module is `server-only` and reads the Figma export from disk via
// node:fs / node:path at import time — fine in Next's server runtime, but it
// breaks in Storybook's browser bundle. It's pulled in transitively because
// `components/docs/registry.tsx` imports the Foundations/Design-Token reference
// components at the top level. Those reference components are never RENDERED in
// any story, so these no-ops just need to exist to keep the graph browser-safe.
// (Foundations / Design-Token pages live in the server-rendered /docs site.)
//
// Type signatures mirror the real module (lib/design-tokens.ts in the upstream
// app) so this also type-checks under `tsc --noEmit`; only the bodies are
// no-ops. The same file is the `@/lib/design-tokens` target for both the
// Storybook vite alias (main.ts) and the tsconfig path.

export type ColorToken = {
  name: string;
  hex: string;
  alpha: number;
  alias?: string;
  description?: string;
};
export type PaletteFamily = {
  family: string;
  shades: { name: string; shade: string; hex: string; alpha: number }[];
};
export type NumberToken = { name: string; value: number; alias?: string };

export function getColors(_collection: string): ColorToken[] {
  return [];
}
export function getPalette(_collection: string): PaletteFamily[] {
  return [];
}
export function getNumbers(_collection: string): NumberToken[] {
  return [];
}
export function getFontTokens(): Record<string, { name: string; value: number | string }[]> {
  return {};
}
export function getTotals(): { collection: string; count: number }[] {
  return [];
}
