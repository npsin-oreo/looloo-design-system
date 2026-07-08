# icons/custom/

Product/brand-specific SVG icons. Empty until a real product needs one.

Rules (`docs/icon-strategy.md` §9.6):

1. Custom icons must be **SVG React components** (same props surface as
   lucide: `size`? no — accept `className`, spread SVG props, use
   `currentColor` for strokes/fills).
2. Follow the lucide geometry model: 24×24 viewBox, `stroke-width` 2
   (`icon.strokeWidth` token), outline style.
3. **Register in `../icon-registry.ts`** — unregistered customs are a
   forbidden pattern and `npm run audit:icons` reports them.
4. Never import a custom SVG directly into product components; go through
   `<Icon name=…>` or the registry.
