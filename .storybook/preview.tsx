import * as React from "react";
import type { Preview } from "@storybook/nextjs-vite";
import { withThemeByClassName } from "@storybook/addon-themes";

// Pulls in the full token chain: Tailwind v4 + shadcn.css + primitives.css
// (--tw-*/--rdx-*/--brand-*) + brand.css (semantic aliases) + the structural
// @theme. primitives.css/brand.css are generated — `npm run storybook` rebuilds
// them first (see package.json scripts).
import "../app/globals.css";

const preview: Preview = {
  parameters: {
    // We center via the decorator below, so let Storybook give us the full
    // canvas with no centering/padding of its own.
    layout: "fullscreen",
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // Fail the suite on any a11y violation — EXCEPT color-contrast, which is a
    // token-level concern: the shadcn-default `muted-foreground` / `destructive`
    // tokens sit at ~4.0:1 (below AA 4.5). That's governed in the brand layer
    // (brand.config.json), not per story, so it shouldn't gate component stories.
    a11y: {
      test: "error",
      config: { rules: [{ id: "color-contrast", enabled: false }] },
    },
    backgrounds: { disable: true },
  },
  decorators: [
    // Toolbar light/dark switch — toggles `.dark` on <html>, matching the app's
    // next-themes setup so semantic tokens resolve to the right theme.
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
      parentSelector: "html",
    }),
    // Center the story without shrinking it: flex-col + items-center keeps a
    // definite width (w-full) so demos using `w-full max-w-*` resolve to their
    // intended width instead of collapsing to min-content. min-h-svh lets the
    // themed background fill the whole canvas (incl. dark).
    (Story) => (
      <div className="bg-background text-foreground flex min-h-svh w-full flex-col items-center justify-center gap-4 p-10">
        <Story />
      </div>
    ),
  ],
};

export default preview;
