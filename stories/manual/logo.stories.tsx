import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Logo } from "@/components/ui/logo";
import { virtualAgentLogoArtwork } from "@/brands/virtual-agent/logo-artwork";

const meta: Meta<typeof Logo> = {
  title: "Brand/Logo",
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          "The logo, as a component — not artwork you copy. The DS ships a NEUTRAL white-label placeholder by default; a brand injects its own vector via `artwork` (same overlay topology as the token theme). `type=mark` is the symbol alone; `type=lockup` is symbol + wordmark; `type=horizontal` is the wide lockup. `tone=brand` is the real thing; `tone=mono` collapses it to a single navy; `tone=inverse` is white on a navy plate. Every colour is bound to a brand primitive, so the logo follows a rebrand. Size it with a height utility — the width follows; never scale the vector inside it.",
      },
    },
  },
  args: { type: "lockup", tone: "brand", className: "h-16 w-auto" },
  argTypes: {
    type: { control: "inline-radio", options: ["mark", "lockup", "horizontal"] },
    tone: { control: "inline-radio", options: ["brand", "mono", "inverse"] },
  },
};
export default meta;
type Story = StoryObj<typeof Logo>;

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}

export const Playground: Story = {};

export const NeutralDefault: Story = {
  name: "Neutral (white-label default)",
  parameters: {
    docs: {
      description: {
        story:
          "What the package ships out of the box on `main`: a neutral placeholder mark + wordmark bar. No brand is assumed — a product opts into its own geometry via `artwork`.",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      {(["mark", "lockup", "horizontal"] as const).map((type) => (
        <Cell key={type} label={`type=${type}`}>
          <Logo type={type} className="h-14 w-auto" />
        </Cell>
      ))}
    </div>
  ),
};

export const VirtualAgentBrand: Story = {
  name: "Virtual Agent (brand overlay)",
  parameters: {
    docs: {
      description: {
        story:
          "A brand overlay in action: pass `artwork={virtualAgentLogoArtwork}` (from `@npsin-oreo/design-system/brands/virtual-agent/logo-artwork`). Colour still flows through the `--ll-color-brand-*` tokens the theme recolours — only the vector geometry comes from the brand.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-8">
      {(["mark", "lockup", "horizontal"] as const).map((type) => (
        <div key={type} className="flex flex-col gap-4">
          <span className="text-foreground font-mono text-sm">type={type}</span>
          <div className="flex flex-wrap items-end gap-8">
            <Cell label="tone=brand">
              <Logo type={type} tone="brand" artwork={virtualAgentLogoArtwork} className="h-14 w-auto" />
            </Cell>
            <Cell label="tone=mono">
              <Logo type={type} tone="mono" artwork={virtualAgentLogoArtwork} className="h-14 w-auto" />
            </Cell>
            <Cell label="tone=inverse">
              <Logo type={type} tone="inverse" artwork={virtualAgentLogoArtwork} className="h-20 w-auto" />
            </Cell>
          </div>
        </div>
      ))}
    </div>
  ),
};
