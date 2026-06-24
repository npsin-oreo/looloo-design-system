import type { StorybookConfig } from "@storybook/nextjs-vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(tsx|mdx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
    "@storybook/addon-mcp",
  ],
  staticDirs: ["../public"],
  async viteFinal(viteConfig, { configType }) {
    // Relative asset base so the static build works under a GitHub Pages
    // project subpath (https://<user>.github.io/<repo>/). Dev stays at "/".
    if (configType === "PRODUCTION") viteConfig.base = "./";

    // Tailwind v4 — process app/globals.css (@import "tailwindcss" + @theme inline)
    // directly via the Vite plugin instead of relying on the project's postcss.
    const { default: tailwindcss } = await import("@tailwindcss/vite");
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()];

    // Mirror tsconfig paths ("@/*" -> project root) so "@/..." resolves the
    // same in stories as in the app. Preserve framework aliases (first wins).
    const existing = viteConfig.resolve?.alias;
    const existingArr = Array.isArray(existing)
      ? existing
      : Object.entries(existing ?? {}).map(([find, replacement]) => ({ find, replacement }));
    viteConfig.resolve = {
      ...viteConfig.resolve,
      alias: [{ find: "@", replacement: projectRoot }, ...existingArr],
    };
    return viteConfig;
  },
};

export default config;
