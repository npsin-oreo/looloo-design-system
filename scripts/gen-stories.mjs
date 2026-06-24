#!/usr/bin/env node
/**
 * Generate one Storybook story per component, sourced from the design-system
 * registry (components/docs/registry.tsx) — the single source of truth for the
 * demo + code snippet shown in the Docs panel. Re-run after editing the
 * registry:
 *
 *   npm run gen:stories
 *
 * Slugs that already have a hand-authored `stories/manual/*.stories.tsx` (with
 * interactive controls) are skipped here, so the sidebar has one entry per
 * component. Generated stories live in `stories/generated/` and are wiped +
 * rewritten on every run — never hand-edit them.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registrySrc = readFileSync(join(root, "components/docs/registry.tsx"), "utf8");
const outDir = join(root, "stories/generated");

// Hand-authored Playground stories in stories/manual/ — skip so there's no dupe.
const MANUAL = new Set([
  "button", "input", "textarea", "label", "checkbox", "switch",
  "badge", "card", "avatar", "separator", "skeleton", "alert",
]);

const kebab = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Match: c("slug", "Title", "Category", …
const re = /\bc\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
const entries = [];
let matched = 0;
let m;
while ((m = re.exec(registrySrc)) !== null) {
  matched++;
  if (MANUAL.has(m[1])) continue;
  entries.push({ slug: m[1], title: m[2], category: m[3] });
}
if (matched === 0) {
  console.error("No component entries found in registry.tsx — aborting.");
  process.exit(1);
}

if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const storyFor = ({ slug, title, category }) => `// AUTO-GENERATED from components/docs/registry.tsx — run \`npm run gen:stories\`. Do not edit.
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { getEntry } from "@/components/docs/registry";

const entry = getEntry(${JSON.stringify(slug)})!;

const meta: Meta = {
  title: ${JSON.stringify(`${category}/${title}`)},
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: { component: entry.description },
      source: { code: entry.code, language: "tsx" },
    },
  },
};
export default meta;

export const Demo: StoryObj = { name: ${JSON.stringify(title)}, render: () => <>{entry.demo}</> };
`;

const byCat = {};
for (const e of entries) {
  const dir = join(outDir, kebab(e.category));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${e.slug}.stories.tsx`), storyFor(e));
  (byCat[e.category] ??= []).push(e.title);
}

console.log(`Generated ${entries.length} stories (${matched - entries.length} hand-authored in stories/manual/)`);
for (const [cat, items] of Object.entries(byCat)) {
  console.log(`  ${cat} (${items.length}): ${items.join(", ")}`);
}
