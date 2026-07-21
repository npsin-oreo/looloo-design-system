// Generates token-contract.json — the canonical list of THEMEABLE token names this
// design system exposes. A consumer's brand.config / DesignOps Step 2.6 brand_config
// may only set keys listed here; anything else is a typo or a token the DS ignores.
//
//   node scripts/build-token-contract.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { warnDeprecated } from "./_deprecated.mjs";

warnDeprecated({
  script: "tokens:contract (scripts/build-token-contract.mjs) — generates the ROOT token-contract.json",
  replacement: "the generated .designops/token-contract.json (scripts/tokens/build-contract.mjs)",
});

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const brand = JSON.parse(readFileSync(join(root, "brand.config.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const colorTokens = Object.keys(brand.light); // light === dark keys (verified)
// scalars the theme may override; fonts.* map to font_<name> (note is a comment, skip)
const scalarTokens = ["radius", ...Object.keys(brand.fonts).filter((f) => f !== "note").map((f) => `font_${f}`)];
// non-colour design axes (typography/motion/layout) — themeable scalars beyond colour + radius/font
const axisTokens = Object.keys(brand.axes ?? {});

const contract = {
  package: pkg.name,
  version: pkg.version,
  generated_from: "brand.config.json",
  modes: Object.keys(brand).filter((k) => k === "light" || k === "dark"),
  color_tokens: colorTokens,
  scalar_tokens: scalarTokens,
  axis_tokens: axisTokens,
};

writeFileSync(join(root, "token-contract.json"), JSON.stringify(contract, null, 2) + "\n");
console.log(`token-contract.json: ${colorTokens.length} color + ${scalarTokens.length} scalar + ${axisTokens.length} axis tokens`);
